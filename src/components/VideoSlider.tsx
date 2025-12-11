'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

interface VideoSliderProps {
  videos: Array<{
    id: number;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url?: string;
    created_at: string;
  }>;
  isDarkMode: boolean;
}

export default function VideoSlider({ videos, isDarkMode }: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection > 0) {
        return prevIndex === videos.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? videos.length - 1 : prevIndex - 1;
      }
    });
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-play functionality - only when video is not playing
  useEffect(() => {
    if (videos.length <= 1 || isVideoPlaying) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 15000); // Change video every 15 seconds (increased from 5)

    return () => clearInterval(interval);
  }, [videos.length, currentIndex, isVideoPlaying]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎥</div>
        <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          No Videos Yet
        </h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Videos will be added soon to showcase the agent&apos;s capabilities.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Video Display */}
      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
                         <VideoPlayer
               src={videos[currentIndex].video_url}
               poster={videos[currentIndex].thumbnail_url}
               className="w-full h-full object-cover"
               onPlay={() => setIsVideoPlaying(true)}
               onPause={() => setIsVideoPlaying(false)}
               onEnded={() => setIsVideoPlaying(false)}
             />
          </motion.div>
        </AnimatePresence>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className={`text-xl font-bold text-white mb-2`}>
            {videos[currentIndex].title}
          </h3>
          <p className={`text-sm text-gray-200 mb-2`}>
            {videos[currentIndex].description}
          </p>
          <p className={`text-xs text-gray-300`}>
            {new Date(videos[currentIndex].created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Navigation Arrows */}
        {videos.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {videos.length > 1 && (
        <div className="mt-6">
          <div className="flex justify-center space-x-3">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-2 ring-yellow-500 scale-110' 
                    : 'hover:scale-105'
                }`}
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="text-white text-lg">🎥</div>
                  </div>
                )}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Counter */}
      {videos.length > 1 && (
        <div className="text-center mt-4">
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {currentIndex + 1} of {videos.length}
          </span>
        </div>
      )}
    </div>
  );
} 