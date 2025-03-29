import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    // Validate input
    if (!content) {
      return new Response("Content is required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
      Structured Title, Description, and Responses Extraction from Script Concept  

      Rules:  
      - Extract only the exact same Title, Description, and Responses elements from the provided script concept.  
      - Do not add, modify, or generate any new Title, Description, and Responses.  
      - Ensure a well-structured plain text output without markdown or unnecessary symbols.  

      Response Format:  
      [Exact Same Title]
      
      [Exact Same Description]
      
      Structured Response:
      [Structured Response] with one-line spacing between each element. Remove any unnecessary symbols or markdown and add one-line spacing.

      Script Concept to Analyze:  ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
