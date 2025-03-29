import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function validateJSONWithAI(jsonText: string, selectLanguage: string) {
  const validationPrompt = `
    You are an AI JSON validator. Your task:
    - Ensure the JSON strictly follows the schema.
    - Correct any formatting issues or missing fields.
    - Do NOT add explanations, markdown, or extra text—return ONLY JSON.
    - Ensure all the fields are filled. If not add the content related to it.

    **Expected JSON Format:**
    {
        "firstSceneNarration": "Opening Narration",
        "dialogs": [
            {
                "sceneTitle": "Scene Title",
                "backgroundVoiceNarration": "Background Voice",
                "dialog": [
                    {
                        "character": "Character Name",
                        "gender": "Character Gender",
                        "dialog": "Dialog Text"
                    }
                ]
            }
        ],
        "lastSceneDialog": "Final Scene Dialog"
    }

    **Validate & Correct JSON:**
    ${jsonText}

    **Return ONLY JSON, no extra text.**
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
  const result = await model.generateContent(validationPrompt);
  const response = await result.response;
  const text = await response.text();

  console.log("🔹 AI Validation Response:", text); // Debugging Log

  // Extract JSON reliably
  const validatedTextMatch = text.match(/\{[\s\S]*\}/);
  if (!validatedTextMatch) {
    throw new Error("AI validation failed: No JSON detected.");
  }

  try {
    return JSON.parse(validatedTextMatch[0]); // Ensure valid JSON
  } catch {
    throw new Error("Invalid JSON returned after AI validation");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstScene, scenes, lastScene, selectLanguage } =
      await request.json();

    // Validate input fields
    if (!firstScene || !scenes || !lastScene || !selectLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `
    **Extract Structured Dialogs in ${selectLanguage}**

    **Rules:**
    - Extract ONLY the dialogs from the script.
    - Ensure all the fields are filled.
    - Keep the number of dialogs equal to the number of scenes.
    - No modifications, extra dialogs, or changes.
    - Maintain background narration per scene.
    - The first scene must include the opening narration.
    - The last scene should only contain its dialog.

    **Strictly Expected JSON Format with all the content filled:**
    {
        "firstSceneNarration": "Opening Narration",
        "dialogs": [
            {
                "sceneTitle": "Scene Title",
                "backgroundVoiceNarration": "Background Voice",
                "dialog": [
                    {
                        "character": "Character Name",
                        "gender": "Character Gender",
                        "dialog": "Dialog Text"
                    }
                ]
            }
        ],
        "lastSceneDialog": "Final Scene Dialog"
    }

    **Analyze the following script:**
    First Scene: ${JSON.stringify(firstScene)}
    Scenes: ${JSON.stringify(scenes)}
    Last Scene: ${JSON.stringify(lastScene)}

    **Language:** ${selectLanguage}

    **Return ONLY JSON—no explanations, markdown, or extra text.**
    `;

    const result = await model.generateContent(prompt);
    const responseAI = await result.response;
    const aiText = await responseAI.text();

    console.log("🔹 Raw AI Response:", aiText); // Debugging Log

    // Extract JSON reliably
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No valid JSON found in AI response:", aiText);
      throw new Error("No valid JSON found in AI response.");
    }

    const cleanText = jsonMatch[0].replace(/```json/g, "").replace(/```/g, "");

    // Validate & correct JSON using AI before sending to frontend
    const jsonData = await validateJSONWithAI(cleanText, selectLanguage);

    return NextResponse.json(jsonData);
  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
