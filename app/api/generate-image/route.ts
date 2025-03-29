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

async function generateImage(title: string, prompt: string): Promise<string> {
  if (!title) {
    throw new Error("Missing title for scene");
  }
  if (!prompt) {
    throw new Error("Missing prompt for scene");
  }

  const mainprompt = `Create a highly detailed, ultra-realistic 4K cinematic book cover illustration based on the following narrative:  

**Title:** ${title} (bold text prominently displayed on the cover)  
**Scene Description:** ${prompt}`;

  let lastError: unknown;
  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await hf.textToImage({
        inputs: mainprompt, // Fix: Use the correctly formatted main prompt
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
            { folder: "story-images", resource_type: "image" },
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
      console.warn(`⚠️ Attempt ${attempt} failed for scene:`, error);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.error("🚨 All retries failed for scene:", lastError);
  throw new Error(
    `Failed to generate scene image after ${maxRetries} attempts`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received request payload:", JSON.stringify(body, null, 2));

    const { title, prompt } = body;

    if (!title || !prompt) {
      console.error("🚨 Invalid input data:", { title, prompt });
      return NextResponse.json(
        { error: "Invalid input: Missing title or prompt" },
        { status: 400 }
      );
    }

    const sceneUrl = await generateImage(title, prompt);

    console.log("✅ Image generated successfully:", sceneUrl);
    return NextResponse.json({
      title,
      sceneUrl,
    });
  } catch (error) {
    console.error("❌ Critical image generation failure:", error);
    return NextResponse.json(
      {
        error: "Failed to generate scene image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
