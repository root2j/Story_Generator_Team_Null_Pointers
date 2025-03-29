// app/api/analyze-character/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { content, selectedLanguage } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!selectedLanguage) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
    ANALYZE THE PROVIDED CONTENT IN ${selectedLanguage} AND EXTRACT CHARACTER INFORMATION.

    -- ANALYSIS PROCESS --  
    Follow a structured and logical approach to extract character details in ${selectedLanguage}.  

    Step 1: UNDERSTAND THE REQUEST → Identify the objective and scope of the analysis.  
    Step 2: IDENTIFY CHARACTERS → Detect all explicitly mentioned and implied characters.  
    Step 3: ANALYZE RELATIONSHIPS → Determine character interactions and their narrative roles.  
    Step 4: EXTRACT KEY TRAITS → Identify defining physical and personality traits for each character.  
    Step 5: SUMMARIZE CONCISELY → Provide clear and meaningful descriptions without speculation.  
    Step 6: ENSURE STRUCTURED OUTPUT → Format the output as a valid JSON array with no extraneous text.

    -- RESPONSE GUIDELINES --  
    1. Always include a ‘thinking’ section outlining the step-by-step analysis.  
    2. Capture all relevant characters from the content.  
    3. Return output strictly in JSON format (no markdown or additional symbols).  
    4. Avoid assumptions—only include information explicitly present in the content.  
    5. Ensure the output is valid JSON without any explanations or additional commentary. 
    6. If gender is not specified, provide the most appropriate designation.
    7. If the user has not specid

    -- OUTPUT FORMAT --  
    The response must be a properly structured JSON object in ${selectedLanguage}, adhering to the following structure:

    {
        "thinking": [
            {
                "stepname": "Step Name",
                "thinking": "Detailed explanation of the analytical process, ensuring clarity and logical reasoning."
            }
        ],
        "characters": [
            {
                "name": "Full Name of Character",
                "gender": "Specify the character’s gender (Male, Female, Non-Binary, Other). If unspecified, provide the most appropriate designation.",
                "characteristics": ["Trait 1", "Trait 2", "Trait 3"],
                "description": "Comprehensive summary of the character's physical appearance and personality."
            }
        ]
    }

    -- IMPORTANT RULES --  
    - The ‘thinking’ section must provide a structured breakdown of the analysis.  
    - Extract and list all identifiable characters from the content.  
    - Ensure the output is a valid JSON structure, free from markdown formatting or extra text.  
    - Do not infer or fabricate missing details.  
    - The response must contain only structured JSON—no additional commentary.
    - If gender is not specified, provide the most appropriate designation.

    -- CONTENT TO ANALYZE --  
    ${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const cleanText = jsonMatch[0]
      // Remove JSON markdown wrappers
      .replace(/```json/g, "")
      .replace(/```/g, "")
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, "$1");

    // Parse and validate response structure
    const jsonData = JSON.parse(cleanText);

    if (!jsonData.thinking || !Array.isArray(jsonData.characters)) {
      throw new Error("Invalid response structure from AI");
    }

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
