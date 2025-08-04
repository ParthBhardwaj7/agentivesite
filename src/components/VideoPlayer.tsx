'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function VideoPlayer({ src, poster, className = "", controls = true, onPlay, onPause, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientation, setOrientation] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      // Check if video has rotation metadata
      const videoElement = video as any;
      if (videoElement.videoWidth && videoElement.videoHeight) {
        // If video is taller than wide, it might be rotated
        if (videoElement.videoHeight > videoElement.videoWidth) {
          setOrientation(0); // Keep normal orientation
        } else {
          setOrientation(0); // Keep normal orientation
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  const getVideoStyle = () => {
    if (orientation === 0) {
      return {
        transform: 'rotate(0deg)',
        transformOrigin: 'center center'
      };
    }
    return {};
  };

  return (
                 <video
               ref={videoRef}
               controls={controls}
               className={className}
               poster={poster}
               style={getVideoStyle()}
               playsInline
               onPlay={onPlay}
               onPause={onPause}
               onEnded={onEnded}
             >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      <source src={src} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  );
} 