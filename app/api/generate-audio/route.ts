import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import FormData from "form-data";

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

const GENDER_VOICE_MAP: { [key: string]: string } = {
  male: "ErXwobaYiN019PkySvjV",
  female: "LcfcDJNUP1GQjkzn1xUU",
};

const NARRATOR_VOICE_ID = "N2lVS1w4EtoT3dr4eOWO";

const RATE_LIMIT_DELAY = 2000;
const MAX_RETRIES = 3;

interface Dialog {
  character: string;
  gender: string;
  dialog: string;
}

interface Scene {
  sceneTitle: string;
  backgroundVoiceNarration: string;
  dialog: Dialog[];
}

interface InputData {
  firstSceneNarration: string;
  dialogs: Scene[];
  lastSceneDialog: string;
}

interface SceneAudioEntry {
  [sceneTitle: string]: {
    audioUrl: string | null;
  };
}

async function generateAudio(
  text: string,
  voiceId: string,
  retries = MAX_RETRIES
): Promise<ArrayBuffer | null> {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
          accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API error response:", error.response?.data);
      if (error.response?.status === 429 && retries > 0) {
        console.log(
          `Rate limit hit. Retrying in ${RATE_LIMIT_DELAY / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
        return generateAudio(text, voiceId, retries - 1);
      }
    } else if (error instanceof Error) {
      console.error("API request error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}

async function uploadToCloudinary(
  audioBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  try {
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary credentials are missing in environment variables"
      );
    }

    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename: fileName,
      contentType: "audio/mpeg",
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", "raw");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      formData,
      { headers: formData.getHeaders() }
    );

    return response.data.secure_url;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Cloudinary Response Error:", error.response?.data);
    } else if (error instanceof Error) {
      console.error("Cloudinary upload error:", error.message);
    }
    return null;
  }
}

function getVoiceId(gender: string): string {
  return GENDER_VOICE_MAP[gender.toLowerCase()] || GENDER_VOICE_MAP.male;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const inputData: InputData = await request.json();

    // Process first scene narration
    const firstSceneAudio = await generateAudio(
      inputData.firstSceneNarration,
      NARRATOR_VOICE_ID
    );
    if (!firstSceneAudio) {
      throw new Error("Failed to generate first scene audio");
    }
    const firstSceneUrl = await uploadToCloudinary(
      Buffer.from(firstSceneAudio),
      `first-scene-${uuidv4()}.mp3`
    );

    // Process main scenes
    const sceneAudioUrls: SceneAudioEntry[] = [];
    for (const scene of inputData.dialogs) {
      // Generate background narration
      const bgAudio = await generateAudio(
        scene.backgroundVoiceNarration,
        NARRATOR_VOICE_ID
      );
      if (!bgAudio) {
        throw new Error(
          `Failed to generate background narration for scene: ${scene.sceneTitle}`
        );
      }
      let sceneBuffer = Buffer.from(bgAudio);

      // Process character dialogs
      for (const dialog of scene.dialog) {
        const voiceId = getVoiceId(dialog.gender);
        const dialogAudio = await generateAudio(dialog.dialog, voiceId);
        if (!dialogAudio) {
          throw new Error(
            `Failed to generate dialog audio for character: ${dialog.character}`
          );
        }
        sceneBuffer = Buffer.concat([sceneBuffer, Buffer.from(dialogAudio)]);
      }

      // Upload combined scene audio
      const sceneFileName = `scene-${scene.sceneTitle}-${uuidv4()}.mp3`;
      const sceneAudioUrl = await uploadToCloudinary(
        sceneBuffer,
        sceneFileName
      );
      sceneAudioUrls.push({
        [scene.sceneTitle]: {
          audioUrl: sceneAudioUrl,
        },
      });
    }

    // Process last scene
    const lastSceneAudio = await generateAudio(
      inputData.lastSceneDialog,
      NARRATOR_VOICE_ID
    );
    if (!lastSceneAudio) {
      throw new Error("Failed to generate last scene audio");
    }
    const lastSceneUrl = await uploadToCloudinary(
      Buffer.from(lastSceneAudio),
      `last-scene-${uuidv4()}.mp3`
    );

    return NextResponse.json({
      firstScene: firstSceneUrl,
      dialogs: sceneAudioUrls,
      lastScene: lastSceneUrl,
    });
  } catch (error: unknown) {
    console.error("Error processing request:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
