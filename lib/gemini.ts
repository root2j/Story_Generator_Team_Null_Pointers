import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "AIzaSyCqxBA7P8F0P58BhUf0KZGHPXHG1ReheqQ"
);

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
