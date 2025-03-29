import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "NEXT_PUBLIC_GEMINI_API_KEY is missing in environment variables"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Script concept is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
        You are an advanced AI model specializing in structured data analysis. Your task is to evaluate the given script concept and determine whether it is valid for generating a structured scene.

        Evaluation Criteria:
        - A valid script concept must provide sufficient context, structure, or details to generate a coherent scene.
        - If the provided concept meets these requirements, classify it as valid.
        - If the concept lacks clarity, coherence, or essential details, classify it as invalid.

        Instructions:
        - Respond strictly in valid JSON format—do not include any additional explanations or text.
        - Your response must not contain markdown formatting, extra punctuation, or unnecessary characters.
        - Only return one of the following JSON objects based on your evaluation:

        Valid Concept:
        {
            "isPromptValid": true
        }

        Invalid Concept:
        {
            "isPromptValid": false
        }

        Script Concept to Analyze:
        ${content}

        Important:
        - Ensure your response is always a properly formatted JSON object.
        - Do not add markdown, explanations, or additional text—only return the JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON");
    }

    const cleanText = jsonMatch[0]
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonData = JSON.parse(cleanText);

    if (typeof jsonData.isPromptValid !== "boolean") {
      throw new Error("Invalid response structure from AI");
    }

    return NextResponse.json(jsonData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
