import { GoogleGenerativeAI } from "@google/generative-ai";
import { StoryContext } from "./story-context";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface StoryContext {
  characters: string[];
  pastDecisions: string[];
  significantEvents: string[];
  currentScene: string;
}

export async function generateStory(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

export async function generateStoryOptions(
  context: StoryContext
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
      Based on the following story context, generate 3 different possible choices/actions the protagonist could take next. 
      Each option should be concise (about 10-15 words), clear, and lead the story in a different direction.
      Do not number the options. Just return the 3 options directly, one per line.
      
      Characters: ${context.characters.join(", ")}
      
      Previous decisions: ${context.pastDecisions.join(", ")}
      
      Significant events: ${context.significantEvents.join(", ")}
      
      Current scene: ${context.currentScene}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split response into individual options and clean them
    return text
      .split("\n")
      .map((option) => option.trim())
      .filter((option) => option.length > 0)
      .slice(0, 3); // Ensure we only return max 3 options
  } catch (error) {
    console.error("Error generating story options:", error);
    return [
      "Continue exploring the current situation",
      "Take a different approach",
      "Seek additional information",
    ];
  }
}
