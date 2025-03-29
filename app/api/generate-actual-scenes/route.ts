// app/api/analyze-scene/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Helper function to safely parse JSON
const sanitizeAndParseJSON = (jsonString: string) => {
  try {
    // Remove all markdown code blocks and control characters
    const sanitized = jsonString
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[\x00-\x1F]/g, "") // Remove control characters
      .trim();

    return JSON.parse(sanitized);
  } catch (error) {
    console.error("JSON sanitization failed:", error);
    throw new Error("Failed to parse and sanitize JSON response");
  }
};

export async function POST(request: NextRequest) {
  try {
    const { scriptConcept, charactersResponse, selectLanguage } =
      await request.json();

    // Validate input (existing validation remains the same)
    if (!scriptConcept || !selectLanguage || !charactersResponse) {
      return new Response(
        JSON.stringify({
          error:
            "scriptConcept, charactersResponse and selectLanguage are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Existing prompt configuration remains the same
    const analysisPrompt = `
### **Role:**
You are a **Senior Cinematic Script Analyst**, specializing in film narrative analysis and scene composition. Your task is to extract **6 highly detailed cinematic scenes** from the provided script (${scriptConcept}), ensuring **absolute character and background consistency** using ${charactersResponse}, while dynamically varying attire and specific character details per scene.

- **Complete Character Embedding Per Scene:**  
  Each scene must include the **character’s full description within the scene’s description itself**, just like:  
  *Elias Vance (37, gaunt face etched with worry, wearing a worn thermal uniform, his breath fogging in the frigid air)*.  
  This **must be written in every scene**, ensuring absolute continuity while preventing identical repetitions.  

- **Strict Attire Variation:**  
  - **No scene should reuse the same attire or accessories** from previous scenes.  
  - **Modify clothing, accessories, or slight environmental effects** while keeping character identity intact.  
  - Example:  
    - Scene 1: *Elias Vance (37, gaunt face, clad in a weathered leather trench coat, his breath misting in the icy air).*  
    - Scene 2: *Elias Vance (37, deep-set eyes shadowed by fatigue, now in a dark tactical vest, steam rising as he exhales into the cold).* 

    Main Requirement: In each and every scene i want the character details compulsorily. i.e firstScene, scenes and finalScene

### **Core Requirements:**
- **Character Consistency Without Repetition:** Each character must retain their **core identity (facial features, demeanor, personality, presence)** while **changing attire, accessories, and subtle appearance details per scene** to reflect natural variations.
- **Seamless Scene Flow:** The **ending of each scene should naturally transition into the next**, ensuring smooth continuity.
- **Fixed Background:** The **same background** must be used in all scenes, with **only camera angles, character positioning, and minor elements changing**.
- **Mandatory Character Embedding:** Every scene must include full **character descriptions directly within the scene’s description**, ensuring consistency but avoiding direct repetition from previous scenes.
- **Cinematic Depth:** Each scene’s **description** must explicitly include **character attire, facial features, textures, actions, body language, emotions, and precise camera angles** while keeping the background unchanged.
- **Dynamic Attire & Variation:** Avoid reusing the same **attire, accessories, or descriptive phrases** from previous scenes. Each scene must introduce **new clothing elements, subtle hair adjustments, or accessory changes** while maintaining character integrity.
- **Extended Dialogues:** Each character’s dialogue must exceed **20 seconds** (minimum three full sentences).
- **Compulsory 6 Key Scenes:** Ensure at least **six significant, structured scenes** are embedded within the analysis.
- In every scene i want perfect character details and avoid using same attire,same details. For example i want in this way  Elias Vance (37, gaunt face etched with worry, wearing a worn thermal uniform, his breath fogging in the frigid air in every scene



### **Output Format (JSON)**
The response must be in **pure JSON format**, embedding all character details directly into each scene’s description.

\`\`\`json
{
  "analysis": {
    "genre": "Extracted genre...",
    "themes": "Extracted core themes...",
    "emotionalArc": "Description of emotional progression...",
    "keyCharacters": "Character details derived from charactersResponse...",
    "visualStyle": "Cinematic style, lighting, framing, and atmosphere...",
    "narrativeStructure": "How scenes interconnect to build the story..."
  },
  "prompt":"Title of the story",
  "firstScene": {
    "sceneTitle": "First Scene Title...",
    "description": "[MANDATORY] A highly detailed cinematic description, embedding full character attire, facial features, textures, body language, emotions, lighting, and camera angles. Character attire must be **unique to this scene** and should not be repeated in later scenes. The background remains unchanged for consistency.",
    "backgroundVoiceNarration": "Narration describing scene events...",
    "characters": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "attire": "Unique, scene-specific outfit description...",
        "facialFeatures": "Notable facial traits...",
        "actions": "Specific character actions reflecting emotions and intent..."
      }
    ],
    "dialog": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "dialog": "Long-form dialogue exceeding 20 seconds..."
      }
    ]
  },
  "scenes": [
    {
      "sceneTitle": "Scene 1 Title...",
      "description": "[MANDATORY] A seamless continuation of the previous scene, maintaining absolute character and background consistency. **All attire, accessories, and descriptive details must be unique to this scene**, ensuring variation while preserving character identity. It must include attire, facial features, textures, body language, emotions, lighting, and camera angles while ensuring a fixed background.",
      "backgroundVoiceNarration": "Narration describing scene events...",
      "characters": [
        {
          "name": "Character Name",
          "gender": "Character Gender",
          "attire": "New, scene-specific attire description...",
          "facialFeatures": "Slightly adjusted traits (e.g., lighting impact, expressions)...",
          "actions": "Unique actions aligned with scene tone..."
        }
      ],
      "dialog": [
        {
          "name": "Character Name",
          "gender": "Character Gender",
          "dialog": "Long-form dialogue exceeding 20 seconds..."
        }
      ]
    }
  ],
  "finalScene": {
    "sceneTitle": "Final Scene Title...",
    "description": "[MANDATORY] The climactic final scene, maintaining absolute character and background consistency while incorporating **final scene-specific attire and accessory variations**. Explicitly include character details, emotional intensity, and professional cinematic techniques.",
    "backgroundVoiceNarration": "Narration describing scene events...",
    "characters": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "attire": "Final scene attire, distinct from all previous outfits...",
        "facialFeatures": "Lighting adjustments, expressions reflecting climax...",
        "actions": "Emotionally charged, scene-driven actions..."
      }
    ],
    "dialog": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "dialog": "Long-form dialogue exceeding 20 seconds..."
      }
    ]
  },
  "comingSoonTeaser": {
    "sceneTitle": "Teaser Scene Title...",
    "description": "[MANDATORY] A cinematic teaser scene ensuring full character consistency while subtly modifying attire or minor accessories. A heartbeat echoes in the silence. Then, in bold, metallic lettering, the words emerge— *Coming This Summer – Season 2025.*",
    "backgroundVoiceNarration": "Narration describing scene events...",
    "characters": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "attire": "Subtle teaser scene outfit variation...",
        "facialFeatures": "Slightly altered expressions matching teaser tone...",
        "actions": "Minimalist, suspense-building actions..."
      }
    ],
    "dialog": [
      {
        "name": "Character Name",
        "gender": "Character Gender",
        "dialog": "Long-form dialogue exceeding 20 seconds..."
      }
    ]
  }
}
\`\`\`

### **Execution Guidelines:**
✅ Extract **only** from ${scriptConcept} (No additional, invented scenes).  
✅ Mandatory include 6 scenes.
✅ Maintain **character and background consistency** using ${charactersResponse}.  
✅ Ensure **smooth scene transitions**, with each scene picking up where the last ended.  
✅ **Fixed background** throughout, with only angle and positioning adjustments.  
✅ **Mandatory full character details in every scene’s description**, ensuring absolute consistency.  
✅ **Every scene must feature different attire, accessories, and subtle descriptive variations to prevent repetition.**  
✅ **Extended dialogues exceeding 20 seconds per character.**  
✅ Use **cinematic storytelling language** for professional AI-driven video generation.  

**Script for Analysis:**
\`\`\`
${scriptConcept}
\`\`\`
`;

    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const analysis = response.text();

    // Improved error handling and logging
    console.log("Raw Gemini Response:", analysis); // For debugging purposes

    try {
      const parsedAnalysis = sanitizeAndParseJSON(analysis);
      return new Response(JSON.stringify(parsedAnalysis), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Failed to parse AI response",
          details: "Invalid JSON format received from AI model",
          rawResponse: analysis, // Include for debugging
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze script",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
