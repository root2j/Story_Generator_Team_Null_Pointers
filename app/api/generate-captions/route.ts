import { NextResponse } from "next/server";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { createClient } = require("@deepgram/sdk");

interface Word {
  start: number;
  end: number;
  word: string;
}

interface CaptionResult {
  words: Word[];
  startTime: number;
  endTime: number;
}

interface DialogItem {
  [key: string]: { audioUrl: string };
}

export async function POST(request: Request) {
  try {
    const { firstSceneAudioUrl, dialogAudioUrls, lastSceneAudioUrl } =
      await request.json();

    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      return NextResponse.json(
        { error: "Deepgram API key is missing." },
        { status: 500 }
      );
    }

    const deepgram = createClient(deepgramApiKey);

    const transcribeAudio = async (url: string): Promise<CaptionResult> => {
      const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        { url },
        { model: "nova-3", smart_format: true, detect_language: true }
      );

      if (error) throw error;

      const words = result.results?.channels[0]?.alternatives[0]?.words || [];
      let startTime = 0;
      let endTime = 0;

      if (words.length > 0) {
        startTime = words[0].start;
        endTime = words[words.length - 1].end;
      }

      return { words, startTime, endTime };
    };

    const [firstSceneCaption, lastSceneCaption] = await Promise.all([
      transcribeAudio(firstSceneAudioUrl),
      transcribeAudio(lastSceneAudioUrl),
    ]);

    const dialogPromises = dialogAudioUrls.map(
      async (dialogItem: DialogItem) => {
        const sceneName = Object.keys(dialogItem)[0];
        const result = await transcribeAudio(dialogItem[sceneName].audioUrl);
        return { [sceneName]: result };
      }
    );

    const dialogResults = await Promise.all(dialogPromises);
    const dialogCaptions = dialogResults.reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {} as { [key: string]: CaptionResult }
    );

    let totalDuration = 0;
    totalDuration += firstSceneCaption.endTime - firstSceneCaption.startTime;

    (Object.values(dialogCaptions) as CaptionResult[]).forEach((scene) => {
      totalDuration += scene.endTime - scene.startTime;
    });

    totalDuration += lastSceneCaption.endTime - lastSceneCaption.startTime;

    return NextResponse.json({
      firstSceneCaption: {
        words: firstSceneCaption.words,
        startTime: Number(firstSceneCaption.startTime.toFixed(3)),
        endTime: Number(firstSceneCaption.endTime.toFixed(3)),
      },
      dialogCaptions: Object.fromEntries(
        (Object.entries(dialogCaptions) as [string, CaptionResult][]).map(
          ([key, value]) => [
            key,
            {
              words: value.words,
              startTime: Number(value.startTime.toFixed(3)),
              endTime: Number(value.endTime.toFixed(3)),
            },
          ]
        )
      ),
      lastSceneCaption: {
        words: lastSceneCaption.words,
        startTime: Number(lastSceneCaption.startTime.toFixed(3)),
        endTime: Number(lastSceneCaption.endTime.toFixed(3)),
      },
      totalDuration: Number(totalDuration.toFixed(3)),
    });
  } catch (err: unknown) {
    console.error("Transcription error:", err);
    const message =
      err instanceof Error ? err.message : "Transcription failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
