// app/api/video-assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      userId,
      prompt,
      captions,
      audioUrls,
      imageUrls,
      totalDuration,
      content,
    } = await request.json();

    const videoAsset = await prisma.videoAsset.create({
      data: {
        userId,
        prompt,
        captions, // stored as JSON
        audioUrls, // stored as JSON
        imageUrls, // stored as JSON
        totalDuration, // numeric value
        content, // additional field
      },
    });

    if (!videoAsset) {
      return NextResponse.json(
        { error: "Failed to create video asset." },
        { status: 500 }
      );
    }

    //fetch video assets

    const videoAssets = await prisma.videoAsset.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ videoAssets }, { status: 201 });
  } catch (error) {
    console.error("Error saving video asset:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the video asset." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sceneId = searchParams.get("sceneId");
    const userId = searchParams.get("userId");

    if (!sceneId) {
      return NextResponse.json(
        { error: "Scene ID is required." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const cleanSceneId = decodeURIComponent(sceneId);

    const videoAssets = await prisma.videoAsset.findUnique({
      where: {
        id: cleanSceneId,
        userId: userId,
      },
    });

    if (!videoAssets) {
      return NextResponse.json(
        { error: "No video assets found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ videoAssets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets." },
      { status: 500 }
    );
  }
}
