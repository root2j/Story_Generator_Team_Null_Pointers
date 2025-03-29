import React from 'react';
import dynamic from 'next/dynamic';
import { VideoAssets } from '@/store/allinterfaces';
import NoResponse from '@/components/NoResponse';

const VideoPlayerClient = dynamic(() => import('./VideoPlayerClient'), {
    ssr: false,
});

interface VideoPlayerProps {
    finalVideoAssets: VideoAssets | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ finalVideoAssets }) => {
    if (!finalVideoAssets) {
        return <div className='p-2 border border-slate-200 dark:border-slate-700'><NoResponse /></div>;
    }

    return (
        <div style={{ width: '100%' }}>
            <VideoPlayerClient finalVideoAssets={finalVideoAssets} />
        </div>
    );
};

export default VideoPlayer;
