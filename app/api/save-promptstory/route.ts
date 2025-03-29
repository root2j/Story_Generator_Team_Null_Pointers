import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received request payload:", JSON.stringify(body, null, 2));

    const {
      userId,
      storyTitle,
      storyPrompt,
      storyType,
      ageGroup,
      writingStyle,
      complexity,
      bookCoverImage,
      chapterTexts,
      chapterImages,
    } = body; // ✅ Fix: Remove `.req`

    if (
      !userId ||
      !storyTitle ||
      !storyPrompt ||
      !storyType ||
      !ageGroup ||
      !writingStyle ||
      !complexity ||
      !bookCoverImage ||
      !chapterTexts ||
      !chapterImages
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newStory = await db.storyprompt.create({
      data: {
        storypromptId: userId, // Assuming userId is unique for each story
        storyTitle,
        storyPrompt,
        storyType,
        ageGroup,
        writingStyle,
        complexity,
        bookCoverImage,
        chapterTexts,
        chapterImages,
      },
    });

    return NextResponse.json(
      { message: "Story saved successfully", story: newStory },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Save to Database failure:", error);
    return NextResponse.json(
      {
        error: "Failed to save the data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

//Get data from database

export async function GET() {
  try {
    const stories = await db.storyprompt.findMany();
    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Fetching stories failed:", error);
      return NextResponse.json(
        { error: "Failed to fetch stories", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("❌ Fetching stories failed:", error);
      return NextResponse.json(
        { error: "Failed to fetch stories", details: "Unknown error" },
        { status: 500 }
      );
    }
  } finally {
    await db.$disconnect();
  }
}
