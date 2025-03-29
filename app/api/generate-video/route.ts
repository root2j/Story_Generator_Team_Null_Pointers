import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { image_urls, audio_urls } = await req.json();

    if (!image_urls || !audio_urls || image_urls.length !== audio_urls.length) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Define paths
    const publicFolder = path.join(process.cwd(), "public");
    const videoOutput = path.join(publicFolder, "final_video.mp4");

    // Ensure public folder exists
    await fs.mkdir(publicFolder, { recursive: true });

    console.log("Running Python script...");
    const pythonProcess = spawn("python", [
      path.join(process.cwd(), "/public/python/video_generator.py"),
      JSON.stringify(image_urls),
      JSON.stringify(audio_urls),
      videoOutput,
    ]);

    let errorOutput = "";
    let successOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      successOutput += data.toString();
      console.log("Python Output:", data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python Error:", data.toString());
    });

    return new Promise((resolve) => {
      pythonProcess.on("close", async (code) => {
        if (code !== 0) {
          console.error("Python Script Failed:", errorOutput);
          return resolve(
            NextResponse.json(
              { error: `Python script error: ${errorOutput}` },
              { status: 500 }
            )
          );
        }

        console.log("Checking if video exists before upload...");
        try {
          await fs.access(videoOutput); // Ensure file exists before uploading
        } catch (err) {
          return resolve(
            NextResponse.json(
              { error: "Video file was not created" },
              { status: 500 }
            )
          );
        }

        // Upload video to Cloudinary
        console.log("Uploading video to Cloudinary...");
        try {
          const result = await cloudinary.v2.uploader.upload(videoOutput, {
            resource_type: "video",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          });

          console.log("Video uploaded successfully:", result.secure_url);
          resolve(NextResponse.json({ video_url: result.secure_url }));
        } catch (uploadError) {
          console.error("Cloudinary Upload Failed:", uploadError);
          resolve(
            NextResponse.json(
              { error: "Cloudinary upload failed" },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
