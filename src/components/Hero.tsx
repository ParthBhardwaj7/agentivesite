'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  isDarkMode: boolean;
  isMobile: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
  onGetStarted: () => void;
}

export default function Hero({ isDarkMode, isMobile, isHovering, setIsHovering, onGetStarted }: HeroProps) {
  const textClass = isDarkMode ? 'text-white' : 'text-orange-900';

  return (
    <section className="pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6">
      {/* Left */}
      <div className="w-full lg:w-3/5 space-y-6 md:space-y-8 lg:space-y-10 text-center lg:text-left">
        <motion.h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight ${textClass}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Agents That <span className="italic text-yellow-500">Transform</span> Everything
        </motion.h1>
        <motion.p 
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium ${isDarkMode ? 'text-slate-200' : 'text-orange-800'}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Custom AI agents for marketing, HR, customer service, and business operations — working 24/7 to transform your business.
        </motion.p>
        <motion.button
          className="mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-black px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl shadow-2xl text-lg md:text-xl lg:text-2xl hover:shadow-3xl transition relative overflow-hidden group w-full sm:w-auto"
          whileHover={{ scale: 1.05, boxShadow: '0 0 32px #F59E0B' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            repeat: Infinity, 
            repeatType: 'loop',
            repeatDelay: 8
          }}
          onClick={onGetStarted}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="relative z-10">🚀 Get Started Now</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>
      </div>
      
      {/* Right: 3D Agent */}
      <div className="w-full lg:w-2/5 flex justify-center items-center mt-8 md:mt-12 lg:mt-0">
        {!isMobile ? (
          <motion.div
            className={`w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] rounded-2xl md:rounded-3xl shadow-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-yellow-100/60 to-orange-100/60'} flex items-center justify-center relative overflow-hidden border-4 border-yellow-200/30`}
            initial={{ y: 30, opacity: 0, rotateY: -15 }}
            animate={{ y: 0, opacity: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
            whileHover={{ 
              scale: 1.04, 
              boxShadow: '0 0 40px #F59E0B',
              rotateY: 5,
              rotateX: 5
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* 3D Agent with enhanced animations */}
            <motion.div 
              className="w-full h-full flex items-center justify-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl relative"
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 8, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                repeatType: 'loop',
                ease: "easeInOut"
              }}
            >
              🤖
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-3xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, repeatType: 'loop' }}
            />
          </motion.div>
        ) : (
          <motion.div 
            className={`w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] rounded-2xl md:rounded-3xl shadow-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-yellow-100/60 to-orange-100/60'} flex items-center justify-center border-4 border-yellow-200/30`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`text-7xl ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>🤖</div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 