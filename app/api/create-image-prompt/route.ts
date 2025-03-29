// app/api/analyze-scene/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt, character_details } = await request.json();

    // Validate input
    if (!prompt || !character_details) {
      return new Response(
        JSON.stringify({
          error: "Prompt, character_details are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const analysisPrompt = `  
        As a professional cinematic AI prompt engineer, your task is to generate a highly **realistic** scene by seamlessly merging the given scene description: "${prompt}" with the most relevant character details from: "${character_details}". Your objective is to ensure absolute **realism**, narrative cohesion, and character consistency while enhancing cinematic depth, immersive storytelling, and emotional intensity.  

        ### **Instructions for Realistic Integration:**  
        - Ensure every character precisely matches their provided description, embedding **realistic** physical traits, facial features, attire, and demeanor directly into the scene.  
        - If no exact match exists, generate a **realistic** character description that aligns seamlessly with the scene’s tone, environment, and cinematic aesthetics.  
        - Reinforce mood, atmosphere, and emotional depth while integrating **realistic** visual, behavioral, and environmental elements.  
        - If multiple characters are present, maintain distinct yet **realistically** cohesive representations for each, ensuring smooth interaction within the scene.  
        - Clearly define **realistic** character actions, body language, facial expressions, and camera angles to enhance cinematic authenticity.  

        ### **Final AI Output Format:**  
        Respond **only** with a JSON object in the following structure, ensuring no additional text or explanation is provided:  

        \`\`\`json  
        {  
            "finalprompt": "Final **realistic** scene description with fully integrated characters, setting, and cinematic depth."  
        }  
        \`\`\`  
        `;

    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const analysis = response.text().trim(); // Trim any extra whitespace

    // **Log response to debug errors**
    console.log("Raw Gemini Response:", analysis);

    // **Ensure valid JSON format before parsing**
    if (!analysis.startsWith("{") && !analysis.startsWith("```json")) {
      throw new Error("Invalid JSON format received: " + analysis);
    }

    // **Clean response to remove extra formatting**
    const cleanedResponse = analysis
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // **Safely parse JSON**
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(cleanedResponse);
    } catch (jsonError: unknown) {
      const error = jsonError as Error;
      throw new Error(
        "JSON Parsing Error: " +
          error.message +
          "\nResponse: " +
          cleanedResponse
      );
    }

    // **Return the properly formatted response**
    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze script",
        details: error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
