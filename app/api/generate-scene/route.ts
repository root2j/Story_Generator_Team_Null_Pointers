import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const hf = new HfInference(process.env.HUGGINGFACE_ACCESS_TOKEN);

interface CloudinaryUploadResult {
  secure_url: string;
}

async function generateImage(
  scene: string,
  type: "first" | "regular" | "last"
): Promise<string> {
  if (!scene) {
    throw new Error(`Missing scene content for ${type} scene`);
  }

  const prompt = `Generate a highly detailed, ultra-realistic 4K cinematic scene illustration based on the following narrative:

Scene:
${scene}

Rendering Requirements:
- **Resolution:** 4K (Ultra HD) for maximum clarity.
- **Cinematic Composition:** Expert lighting, depth, and dynamic scene elements.
- **Realistic Background:** Fully immersive, detailed environmental design.
- **Character Expression & Detail:** Emotionally engaging characters with lifelike poses.
- **Professional Color Grading:** Rich, cinematic tones for a polished aesthetic.
- **Hyper-Realistic Textures:** Natural skin tones, fabrics, and environmental elements.
- **Storytelling Precision:** The composition must align with the scene’s mood and theme.`;

  let lastError: unknown;
  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await hf.textToImage({
        inputs: prompt,
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        parameters: {
          num_inference_steps: 50,
          guidance_scale: 7,
          width: 1024,
          height: 1024,
          negative_prompt: `
            low quality, blurry, pixelated, distorted, deformed, 
            black and white, grayscale, text, watermark, 
            cartoonish, unrealistic, overexposed, underexposed,
            extra limbs, disfigured, bad anatomy, poor proportions
          `,
        },
      });

      const buffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      const uploadResult: CloudinaryUploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "scene-images", resource_type: "image" },
            (error, result) => {
              if (error) {
                reject(new Error("Failed to upload image to Cloudinary"));
              } else if (!result?.secure_url) {
                reject(new Error("Cloudinary response missing secure_url"));
              } else {
                resolve(result as CloudinaryUploadResult);
              }
            }
          );
          uploadStream.end(imageBuffer);
        }
      );

      return uploadResult.secure_url;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed for ${type} scene:`, error);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.error(`🚨 All retries failed for ${type} scene:`, lastError);
  throw new Error(
    `Failed to generate ${type} scene image after ${maxRetries} attempts`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received request payload:", JSON.stringify(body, null, 2));

    const { firstScene, scenes, lastScene } = body;

    if (
      !firstScene ||
      !lastScene ||
      !Array.isArray(scenes) ||
      scenes.some((scene) => !scene)
    ) {
      console.error("🚨 Invalid input data:", {
        firstScene: !!firstScene,
        scenes: Array.isArray(scenes),
        lastScene: !!lastScene,
        invalidScenes: scenes?.map((s: any) => !!s),
      });
      return NextResponse.json(
        { error: "Invalid input: Missing required scenes" },
        { status: 400 }
      );
    }

    console.log("🎬 Starting sequential image generation...");

    const [firstSceneUrl, sceneUrls, lastSceneUrl] = await Promise.all([
      generateImage(firstScene, "first"),
      (async () => {
        const urls: string[] = [];
        for (const scene of scenes) {
          urls.push(await generateImage(scene, "regular"));
        }
        return urls;
      })(),
      generateImage(lastScene, "last"),
    ]);

    console.log("✅ All images generated successfully");
    return NextResponse.json({
      firstScene: firstSceneUrl,
      scenes: sceneUrls,
      lastScene: lastSceneUrl,
    });
  } catch (error) {
    console.error("❌ Critical image generation failure:", error);
    return NextResponse.json(
      {
        error: "Failed to generate scene images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
