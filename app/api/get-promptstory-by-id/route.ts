import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storypromptId = searchParams.get("storypromptId");
    const userId = searchParams.get("userId");

    if (!storypromptId || !userId) {
      return NextResponse.json(
        { error: "Story Prompt ID and User ID are required." },
        { status: 400 }
      );
    }

    // Fetch stories based on storypromptId and userId
    const stories = await db.storyprompt.findMany({
      where: {
        id: storypromptId, // Assuming `id` is the correct field for the prompt ID
        storypromptId: userId, // Ensure `userId` exists in your schema
      },
    });

    if (!stories.length) {
      return NextResponse.json({ error: "No stories found." }, { status: 404 });
    }

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories." },
      { status: 500 }
    );
  }
}
