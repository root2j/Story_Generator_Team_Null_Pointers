"use client";

import React from 'react';
import { Player } from "@remotion/player";
import MediaPlayer from './components/MediaPlayer';
import { VideoAssets } from '@/store/allinterfaces';

interface VideoPlayerClientProps {
    finalVideoAssets: VideoAssets;
}

const VideoPlayerClient: React.FC<VideoPlayerClientProps> = ({ finalVideoAssets }) => {
    const [durationInFrames, setDurationInFrames] = React.useState(100);

    console.log(durationInFrames)

    return (
        <Player
            style={{ width: '100%' }}
            component={MediaPlayer}
            durationInFrames={Number(durationInFrames.toFixed(0))}
            compositionWidth={720}
            compositionHeight={520}
            fps={30}
            controls
            inputProps={{
                finalVideoAssets,
                setDurationInFrames: (frameValue: number) => setDurationInFrames(frameValue),
            }}
        />
    );
};

export default VideoPlayerClient;
