import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";

// Helper to wrap promises with a timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), ms)
    ),
  ]);
}

// Helper to introduce delay between operations
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const hf = new HfInference(process.env.HUGGINGFACE_ACCESS_TOKEN);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to generate an image with retries
async function generateImageWithRetry(
  prompt: string,
  attempts: number = 3,
  retryDelayMs: number = 10000 // 10 seconds delay between retries
): Promise<Blob> {
  // Increase timeout to 60 seconds (60000 ms)
  const TIMEOUT_MS = 60000;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const hfPromise = hf.textToImage({
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
      const response = await withTimeout(hfPromise, TIMEOUT_MS);
      if (!(response instanceof Blob)) {
        throw new Error("Invalid image response format");
      }
      return response;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === attempts) {
        throw new Error(
          `Image generation failed after ${attempts} attempts: ${error.message}`
        );
      }
      // Wait before retrying
      await delay(retryDelayMs);
    }
  }
  throw new Error("Unexpected error in image generation");
}

// Process a single character's image generation and database operations
async function processCharacter(data: any): Promise<any> {
  // Validate request body structure for a single character
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request format");
  }

  if (
    !data.character ||
    typeof data.character !== "object" ||
    !data.thinking ||
    !Array.isArray(data.thinking)
  ) {
    throw new Error("Missing or invalid character or thinking data");
  }

  // Destructure character data
  const {
    name,
    description,
    characteristics = [],
    gender = "unspecified",
    type = "realistic",
    traits = [],
  } = data.character;

  if (!name || !description) {
    throw new Error("Missing required character fields");
  }

  const selectedCharacterType = data.selectedCharacterType || "fantasy";

  // Validate traits structure
  if (
    !traits.every(
      (t: any) => t && typeof t.name === "string" && typeof t.value === "number"
    )
  ) {
    throw new Error("Invalid traits format");
  }

  // Format traits for prompt
  const formattedTraits = traits
    .map((t: { name: string; value: number }) => `${t.name}: ${t.value}%`)
    .join(", ");

  // Generate image prompt
  const prompt = `Create a highly detailed 4K character portrait in ${selectedCharacterType} style of:
**Character Name**: ${name}
**Description**: ${description}
**Character Gender**: ${gender}
**Key Characteristics**: ${characteristics.join(", ")}
**Detailed Traits**: ${formattedTraits}

Requirements:
- Ultra-high resolution (4K quality)
- ${selectedCharacterType}-style artistic interpretation
- Accurate representation of physical traits and proportions
- Expressive facial features matching personality
- Context-appropriate clothing and accessories
- Dynamic lighting and shadows
- Professional color grading
- Detailed background environment`;

  // Generate image with retries
  let imageResponse: Blob;
  try {
    imageResponse = await generateImageWithRetry(prompt);
  } catch (error: any) {
    throw new Error(`Image generation failed: ${error.message}`);
  }

  // Upload image to Cloudinary
  let cloudinaryResult: any;
  try {
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "characters",
          format: "webp",
          quality: "auto:best",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          return resolve(result);
        }
      );
      stream.end(buffer);
    });

    if (!cloudinaryResult?.secure_url) {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  // Database operations wrapped in a transaction
  const result = await db.$transaction(async (prisma) => {
    // Create thought records
    const createdThoughts = await Promise.all(
      data.thinking.map(
        (step: { stepname: string; thinking: string }, index: number) => {
          if (!step.stepname || !step.thinking) {
            throw new Error("Invalid thought step format");
          }
          return prisma.thought.create({
            data: {
              stepname: step.stepname,
              thinking: step.thinking,
              order: index + 1,
            },
          });
        }
      )
    );

    if (createdThoughts.length !== data.thinking.length) {
      throw new Error("Failed to create thoughts");
    }

    // Create the character record
    const character = await prisma.character.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        imageUrl: cloudinaryResult.secure_url,
        type,
        gender: gender.trim(),
        characteristics,
        traits: JSON.stringify(traits),
        metadata: JSON.stringify({
          cloudinaryId: cloudinaryResult.public_id,
          generatedAt: new Date().toISOString(),
          model: "stable-diffusion-xl-base-1.0",
          prompt,
        }),
        thoughts: {
          create: createdThoughts.map((thought) => ({
            thoughtId: thought.id,
          })),
        },
      },
    });

    // Fetch complete character data with associated thoughts
    const fullCharacter = await prisma.character.findUnique({
      where: { id: character.id },
      include: {
        thoughts: {
          include: {
            thought: true,
          },
          orderBy: {
            thought: {
              order: "asc",
            },
          },
        },
      },
    });

    if (!fullCharacter) {
      throw new Error("Character data retrieval failed");
    }

    // Format thoughts for response
    const formattedThoughts = fullCharacter.thoughts.map((association) => ({
      id: association.thought.id,
      stepname: association.thought.stepname,
      thinking: association.thought.thinking,
      order: association.thought.order,
    }));

    return {
      character: fullCharacter,
      thoughts: formattedThoughts,
      imageUrl: cloudinaryResult.secure_url,
    };
  });

  return {
    id: result.character.id,
    imageUrl: result.imageUrl,
    gender: result.character.gender,
    description: result.character.description,
    characteristics: result.character.characteristics,
    traits: JSON.parse(result.character.traits),
    name: result.character.name,
    type: result.character.type,
    metadata: JSON.parse(result.character.metadata),
    thoughts: result.thoughts,
  };
}

export async function POST(req: NextRequest) {
  try {
    console.log("API called: generate-character-image");
    const body = await req.json();

    // If multiple characters are provided, process them sequentially with a delay
    if (body.characters && Array.isArray(body.characters)) {
      const results = [];
      for (const charData of body.characters) {
        const result = await processCharacter(charData);
        results.push(result);
        // Wait for 3 seconds before processing the next image
        await delay(3000);
      }
      return NextResponse.json({ success: true, data: results });
    } else {
      // Process a single character request
      const result = await processCharacter(body);
      return NextResponse.json({ success: true, data: result });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    let status = 500;
    let errorMessage =
      "Character creation failed. Please check your input and try again.";
    let details = error instanceof Error ? error.message : "Unknown error";

    if (error instanceof SyntaxError) {
      status = 400;
      errorMessage = "Invalid request format";
      details = "The request body must be valid JSON";
    } else if (error.name === "AbortError") {
      status = 504;
      errorMessage = "Request timeout";
      details = "The server took too long to respond";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? details : undefined,
      },
      { status }
    );
  }
}
