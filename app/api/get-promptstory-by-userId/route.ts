import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser(); // Fetch the current user on the server

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const stories = await db.storyprompt.findMany({
      where: { storypromptId: userId },
    });

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error("❌ Fetching stories failed:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
