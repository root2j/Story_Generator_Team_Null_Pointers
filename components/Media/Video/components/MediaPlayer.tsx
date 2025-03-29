"use client";
import { VideoAssets } from '@/store/allinterfaces';
import React, { useEffect, useMemo } from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    Video,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig
} from 'remotion';

interface MediaPlayerProps {
    finalVideoAssets: VideoAssets;
    setDurationInFrames: (frameValue: number) => void;
}

interface Dialog {
    audioUrl?: string;
    startTime?: number;
    endTime?: number;
    words?: Word[];
    [key: string]: any; // For nested objects
}


interface Word {
    start: number;
    end: number;
    word: string;
    punctuated_word?: string;
}

const extractAudioUrl = (dialog: Dialog): string => {
    if (dialog.audioUrl) {
        return dialog.audioUrl;
    }
    const keys = Object.keys(dialog);
    if (keys.length > 0) {
        const firstKey = keys[0];
        if (dialog[firstKey] && typeof dialog[firstKey] === 'object' && dialog[firstKey].audioUrl) {
            return dialog[firstKey].audioUrl;
        }
    }
    return '';
};

const extractCaptionData = (dialog: Dialog): { startTime: number; endTime: number; words: Word[] } => {
    if (dialog && typeof dialog.startTime === 'number' && typeof dialog.endTime === 'number' && Array.isArray(dialog.words)) {
        return {
            startTime: dialog.startTime as number,
            endTime: dialog.endTime as number,
            words: dialog.words,
        };
    }
    const keys = Object.keys(dialog);
    if (keys.length > 0) {
        const nested = dialog[keys[0]];
        if (nested && typeof nested.startTime === 'number' && typeof nested.endTime === 'number' && Array.isArray(nested.words)) {
            return {
                startTime: nested.startTime as number,
                endTime: nested.endTime as number,
                words: nested.words,
            };
        }
    }
    return { startTime: 0, endTime: 0, words: [] };
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ finalVideoAssets, setDurationInFrames }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const startVideoUrl = "https://res.cloudinary.com/healthlinker/video/upload/v1743246232/jtvcmcbyu9sryquhua2u.mp4";
    const endVideoUrl = "https://res.cloudinary.com/healthlinker/video/upload/v1743246246/tn9u4rclntkuxoy2nsfk.mp4";
    const gifUrl = "https://i.pinimg.com/originals/2a/33/ca/2a33caa395c56152bc45a860c06a96bf.gif";

    const imageList = [
        finalVideoAssets.imageUrls.firstScene,
        ...finalVideoAssets.imageUrls.scenes,
        finalVideoAssets.imageUrls.lastScene,
        gifUrl,
    ];

    const dialogAudioUrls = finalVideoAssets.audioUrls.dialogs.map((dialog) => extractAudioUrl(dialog));

    const audioList = [
        finalVideoAssets.audioUrls.firstScene,
        ...dialogAudioUrls,
        finalVideoAssets.audioUrls.lastScene
    ];

    const dialogCaptions = Object.values(finalVideoAssets.captions.dialogs).map((dialog) => extractCaptionData(dialog));

    const captionList = [
        finalVideoAssets.captions.firstScene,
        ...dialogCaptions,
        finalVideoAssets.captions.lastScene
    ];

    // Manually set start and end video durations (adjust as needed)
    const startVideoDuration = 10 * fps; // 22 seconds
    const endVideoDuration = 4 * fps;  // 10 seconds

    const baseSceneDurations = useMemo(() => {
        const firstSceneDuration = finalVideoAssets.captions.firstScene.endTime - finalVideoAssets.captions.firstScene.startTime;
        const dialogDurations = Object.values(finalVideoAssets.captions.dialogs).map(
            (dialog) => dialog.endTime - dialog.startTime
        );
        const lastSceneDuration = finalVideoAssets.captions.lastScene.endTime - finalVideoAssets.captions.lastScene.startTime;

        return [firstSceneDuration, ...dialogDurations, lastSceneDuration].map((duration) =>
            Math.max(1, Math.round(duration * fps))
        );
    }, [finalVideoAssets.captions, fps]);

    const sceneDurations = useMemo(() => [startVideoDuration, ...baseSceneDurations, endVideoDuration], [baseSceneDurations]);

    const cumulativeStartTimes = useMemo(() => {
        const starts: number[] = [];
        let cumulative = 0;
        for (const duration of sceneDurations) {
            starts.push(cumulative);
            cumulative += duration;
        }
        return starts;
    }, [sceneDurations]);

    useEffect(() => {
        const totalDurationFrames = sceneDurations.reduce((acc, curr) => acc + curr, 0);
        setDurationInFrames(totalDurationFrames);
    }, [sceneDurations, setDurationInFrames]);

    return (
        <AbsoluteFill>
            {/* Start Video */}
            <Sequence from={cumulativeStartTimes[0]} durationInFrames={startVideoDuration}>
                <Video src={startVideoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Sequence>

            {/* Image Scenes */}
            {imageList.map((image, index) => {
                const sceneStart = cumulativeStartTimes[index + 1];
                const sceneDuration = sceneDurations[index + 1];
                const sceneFrame = frame - sceneStart;
                const sceneTime = sceneFrame / fps;
                let wordToShow = "";
                const captionData = captionList[index];

                if (captionData?.words.length && sceneFrame >= 0 && sceneFrame <= sceneDuration) {
                    let currentWord = captionData.words.find((w) => sceneTime >= w.start && sceneTime < w.end);
                    if (!currentWord) {
                        currentWord = captionData.words[captionData.words.length - 1];
                    }
                    if (currentWord) {
                        wordToShow = currentWord.word;
                    }
                }

                const scale = interpolate(
                    frame,
                    [sceneStart, sceneStart + sceneDuration / 2, sceneStart + sceneDuration],
                    index % 2 === 0 ? [1, 1.5, 1] : [1.5, 1, 1.5],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                    <Sequence key={index} from={sceneStart} durationInFrames={sceneDuration}>
                        <AbsoluteFill>
                            <Img
                                src={image}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `scale(${scale})`
                                }}
                            />
                            {audioList[index] && audioList[index] !== "" && <Audio src={audioList[index]} preload="auto" />}
                            {wordToShow && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '10%',
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '2rem',
                                        color: 'white',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    {wordToShow}
                                </div>
                            )}
                        </AbsoluteFill>
                    </Sequence>
                );
            })}

            {/* End Video */}
            <Sequence from={cumulativeStartTimes[cumulativeStartTimes.length - 1]} durationInFrames={endVideoDuration}>
                <Video src={endVideoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Sequence>
        </AbsoluteFill>
    );
};

export default MediaPlayer;
