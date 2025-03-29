import os
import sys
import json
import requests
from concurrent.futures import ThreadPoolExecutor
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

# Get input from Next.js API
image_urls = json.loads(sys.argv[1])
audio_urls = json.loads(sys.argv[2])
output_video = sys.argv[3]

# Define paths inside `public/` folder
PUBLIC_FOLDER = "public"
IMAGE_FOLDER = os.path.join(PUBLIC_FOLDER, "downloaded_images")
AUDIO_FOLDER = os.path.join(PUBLIC_FOLDER, "downloaded_audio")

# Ensure directories exist
os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# Function to download files
def download_file(url, save_path):
    try:
        with requests.get(url, stream=True) as response:
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    for chunk in response.iter_content(64 * 1024):
                        f.write(chunk)
                return save_path
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

# Download images & audio in parallel
def download_files(urls, folder, prefix, ext):
    save_paths = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {
            executor.submit(download_file, url, os.path.join(folder, f"{prefix}_{i}.{ext}")): i
            for i, url in enumerate(urls)
        }
        for future in futures:
            result = future.result()
            if result:
                save_paths.append(result)
    return save_paths

image_files = download_files(image_urls, IMAGE_FOLDER, "image", "jpg")
audio_files = download_files(audio_urls, AUDIO_FOLDER, "audio", "mp3")

# Ensure equal number of images & audios
min_length = min(len(image_files), len(audio_files))
image_files, audio_files = image_files[:min_length], audio_files[:min_length]

video_clips = []
for img_path, audio_path in zip(image_files, audio_files):
    audio_clip = AudioFileClip(audio_path)
    img_clip = ImageClip(img_path).set_duration(audio_clip.duration).set_audio(audio_clip)
    video_clips.append(img_clip)

# Create final video
final_video = concatenate_videoclips(video_clips, method="compose")
final_video.write_videofile(output_video, fps=24, codec="libx264", audio_codec="aac", preset="ultrafast")

print("Video created successfully!")
