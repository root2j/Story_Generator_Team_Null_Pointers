import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: User is not authenticated." },
        { status: 401 }
      );
    }

    const videoAssets = await db.videoAsset.findMany({
      where: {
        userId: user.id,
      },
    });

    if (videoAssets.length === 0) {
      console.log("No assets found");
    }

    return NextResponse.json({ videoAssets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video assets:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to fetch assets." },
      { status: 500 }
    );
  }
}
