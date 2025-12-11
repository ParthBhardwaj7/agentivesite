'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import VideoSlider from '@/components/VideoSlider';
import FloatingCursor from '@/components/FloatingCursor';

interface Agent {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  photo_url?: string;
  key_value?: string;
  features?: string;
  created_at: string;
  updated_at: string;
}

interface AgentVideo {
  id: number;
  agent_id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  created_at: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id;
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [videos, setVideos] = useState<AgentVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Always use dark mode
  useEffect(() => {
    setIsDarkMode(true);
  }, []);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load agent data
  useEffect(() => {
    if (!agentId) return;

    const loadAgentData = async () => {
      try {
        setLoading(true);
        
        // Load agent details
        const agentResponse = await fetch(`/api/agents/${agentId}`);
        if (!agentResponse.ok) {
          throw new Error('Agent not found');
        }
        const agentData = await agentResponse.json();
        setAgent(agentData);

        // Load agent videos
        const videosResponse = await fetch(`/api/agents/${agentId}/videos`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideos(videosData);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, [agentId]);

  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const bgClass = isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} transition-all duration-500`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className={`mt-4 ${textClass}`}>Loading agent details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className={`min-h-screen ${bgClass} transition-all duration-500`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className={`text-2xl font-bold ${textClass} mb-4`}>Agent Not Found</h1>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              The agent you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-500`}>
      {/* Floating Cursor */}
      <FloatingCursor isDarkMode={isDarkMode} />
      
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onContact={() => {}}
        onAbout={() => {}}
        onServices={() => {}}
        onLogin={openLoginModal}
        user={user}
        showLearnMore={false}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

             {/* Hero Section */}
       <section className="pt-32 md:pt-40 pb-16">
         <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             {/* Left Content */}
             <div className="space-y-8">
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-6">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
                   {agent.name}
                 </h1>
                 <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} mb-6`}>
                   {agent.description}
                 </p>
                 
                 {/* Status Badge */}
                 <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6">
                   <div className={`w-2 h-2 rounded-full mr-2 ${
                     agent.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                   }`}></div>
                   <span className={`${
                     agent.status === 'active' ? 'text-green-700 bg-green-100' : 'text-blue-700 bg-blue-100'
                   } px-3 py-1 rounded-full`}>
                     {agent.status === 'active' ? 'Active' : 'Ready to Launch'}
                   </span>
                 </div>

                 {/* Key Value */}
                 {agent.key_value && (
                   <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'} border-2 ${isDarkMode ? 'border-slate-700' : 'border-yellow-200'}`}>
                     <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Key Value</h3>
                     <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                       {agent.key_value}
                     </p>
                   </div>
                 )}
               </motion.div>
             </div>

             {/* Right: Agent Image */}
             <div className="flex justify-center">
               <motion.div
                 className={`w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-3xl shadow-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-br from-yellow-100/60 to-orange-100/60'} flex items-center justify-center relative overflow-hidden border-4 border-yellow-200/30`}
                 initial={{ y: 30, opacity: 0, rotateY: -15 }}
                 animate={{ y: 0, opacity: 1, rotateY: 0 }}
                 transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                 whileHover={{ 
                   scale: 1.04, 
                   boxShadow: '0 0 40px #F59E0B',
                   rotateY: 5,
                   rotateX: 5
                 }}
               >
                 {agent.photo_url ? (
                   <img 
                     src={agent.photo_url} 
                     alt={agent.name}
                     className="w-full h-full object-cover rounded-3xl"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.nextElementSibling!.style.display = 'flex';
                     }}
                   />
                 ) : null}
                 <div className={`w-full h-full flex items-center justify-center text-8xl lg:text-9xl ${agent.photo_url ? 'hidden' : ''}`}>
                   🤖
                 </div>
                 
                 {/* Glow effect */}
                 <motion.div
                   className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-3xl"
                   animate={{ opacity: [0.3, 0.7, 0.3] }}
                   transition={{ repeat: Infinity, duration: 3, repeatType: 'loop' }}
                 />
               </motion.div>
             </div>
           </div>
         </div>
       </section>

       {/* Videos Section - Moved Up */}
       <section className="py-20">
         <div className="max-w-7xl mx-auto px-6">
           <motion.div
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
               Videos & Demos
             </h2>
             <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mx-auto`}>
               Watch {agent.name} in action with our comprehensive video demonstrations
             </p>
           </motion.div>

           <VideoSlider videos={videos} isDarkMode={isDarkMode} />
         </div>
       </section>

             {/* Features Section */}
       {agent.features && (
         <section className="py-20">
           <div className="max-w-7xl mx-auto px-6">
             <motion.div
               className="text-center mb-16"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
                 Features
               </h2>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {agent.features.split(', ').map((feature, index) => (
                 <motion.div
                   key={index}
                   className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                     isDarkMode
                       ? 'bg-slate-800/50 border-slate-700 hover:border-yellow-500/50'
                       : 'bg-yellow-50/50 border-yellow-200 hover:border-yellow-400'
                   } hover:shadow-2xl hover:scale-105`}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: index * 0.1 }}
                   viewport={{ once: true }}
                 >
                   <div className="text-4xl mb-4">✨</div>
                   <h3 className={`text-xl font-bold mb-3 ${textClass}`}>
                     {feature.trim()}
                   </h3>
                 </motion.div>
               ))}
             </div>
           </div>
         </section>
       )}

       {/* Contact Section */}
       <section className="py-20">
         <div className="max-w-7xl mx-auto px-6">
           <motion.div
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
               Get In Touch
             </h2>
             <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mx-auto`}>
               Ready to integrate {agent.name} into your business? Let&apos;s discuss how we can help you achieve your goals.
             </p>
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             {/* Contact Form */}
             <motion.div
               className={`p-8 rounded-3xl border-2 ${
                 isDarkMode
                   ? 'bg-slate-800/50 border-slate-700'
                   : 'bg-yellow-50/50 border-yellow-200'
               }`}
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Send Us a Message</h3>
               
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                       Name *
                     </label>
                     <input
                       type="text"
                       className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                         isDarkMode
                           ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                           : 'bg-white border-yellow-200 text-slate-900 placeholder-slate-500'
                       }`}
                       placeholder="Your full name"
                       required
                     />
                   </div>
                   <div>
                     <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                       Email *
                     </label>
                     <input
                       type="email"
                       className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                         isDarkMode
                           ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                           : 'bg-white border-yellow-200 text-slate-900 placeholder-slate-500'
                       }`}
                       placeholder="your@email.com"
                       required
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                     Company
                   </label>
                   <input
                     type="text"
                     className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                       isDarkMode
                         ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                         : 'bg-white border-yellow-200 text-slate-900 placeholder-slate-500'
                     }`}
                     placeholder="Your company name"
                   />
                 </div>
                 
                 <div>
                   <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                     Message *
                   </label>
                   <textarea
                     rows={4}
                     className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none ${
                       isDarkMode
                         ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                         : 'bg-white border-yellow-200 text-slate-900 placeholder-slate-500'
                     }`}
                     placeholder={`Tell us about your project and how ${agent.name} can help...`}
                     required
                   />
                 </div>
                 
                 <button
                   type="submit"
                   className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                 >
                   Send Message
                 </button>
               </form>
             </motion.div>

             {/* Contact Info */}
             <motion.div
               className="space-y-8"
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <div className={`p-6 rounded-2xl border-2 ${
                 isDarkMode
                   ? 'bg-slate-800/50 border-slate-700'
                   : 'bg-yellow-50/50 border-yellow-200'
               }`}>
                 <div className="flex items-center mb-4">
                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                     </svg>
                   </div>
                   <div>
                     <h4 className={`text-lg font-semibold ${textClass}`}>Email Us</h4>
                     <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>contact@agentive.ai</p>
                   </div>
                 </div>
               </div>

               <div className={`p-6 rounded-2xl border-2 ${
                 isDarkMode
                   ? 'bg-slate-800/50 border-slate-700'
                   : 'bg-yellow-50/50 border-yellow-200'
               }`}>
                 <div className="flex items-center mb-4">
                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div>
                     <h4 className={`text-lg font-semibold ${textClass}`}>Response Time</h4>
                     <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Within 24 hours</p>
                   </div>
                 </div>
               </div>

               <div className={`p-6 rounded-2xl border-2 ${
                 isDarkMode
                   ? 'bg-slate-800/50 border-slate-700'
                   : 'bg-yellow-50/50 border-yellow-200'
               }`}>
                 <div className="flex items-center mb-4">
                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div>
                     <h4 className={`text-lg font-semibold ${textClass}`}>Free Consultation</h4>
                     <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>No cost, no obligation</p>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>

      

      {/* Footer */}
      <Footer
        isDarkMode={isDarkMode}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        onAbout={() => {}}
      />
    </div>
  );
} 