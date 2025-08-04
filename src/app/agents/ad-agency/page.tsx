'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import Header from '@/components/Header';

export default function AdAgencyPage() {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cursor effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking for cursor effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = openLoginModal;
  const handleContact = () => setShowContact(true);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setContactForm({ name: '', email: '', company: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme classes
  const bgClass = isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-blue-50';
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-500`}>
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      {/* Header Component */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogin={handleLogin}
        onContact={handleContact}
        onAbout={() => {}}
        onServices={() => {}}
        user={user}
        showLearnMore={false}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

      {/* Main Content */}
      <main className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        {/* Agent Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className={`w-24 h-24 rounded-3xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              } flex items-center justify-center text-5xl shadow-2xl`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              🎯
            </motion.div>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4`}>
            Ad Agency AI Agent
          </h1>
          
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto leading-relaxed`}>
            Transform your marketing with AI-powered advertisement creation that understands your brand, 
            analyzes your audience, and generates compelling content that converts.
          </p>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`w-full max-w-4xl mx-auto aspect-video rounded-2xl shadow-2xl overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700' 
              : 'bg-gradient-to-br from-white/80 to-slate-50/80 border border-slate-200'
          } backdrop-blur-sm flex items-center justify-center`}>
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, repeatType: 'loop' }}
              >
                🎬
              </motion.div>
              <h3 className={`text-2xl font-bold mb-2 ${textClass}`}>
                Demo Video Coming Soon
              </h3>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Watch how our Ad Agency AI creates stunning advertisements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Left Column - Features */}
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>
              Key Features
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: '🎨',
                  title: 'Custom Ad Copy Generation',
                  description: 'Generate compelling headlines, descriptions, and call-to-actions tailored to your brand voice and target audience.'
                },
                {
                  icon: '🎯',
                  title: 'Brand-Aligned Messaging',
                  description: 'Ensure every advertisement maintains consistency with your brand identity and core messaging.'
                },
                {
                  icon: '📱',
                  title: 'Multi-Platform Optimization',
                  description: 'Create ads optimized for different platforms including Facebook, Google, Instagram, and LinkedIn.'
                },
                {
                  icon: '📊',
                  title: 'A/B Testing Suggestions',
                  description: 'Get intelligent recommendations for testing different ad variations to maximize performance.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border border-slate-700' 
                      : 'bg-white/60 border border-slate-200'
                  } backdrop-blur-sm`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
                        {feature.title}
                      </h3>
                      <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - How It Works */}
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>
              How It Works
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Input Your Preferences',
                  description: 'Tell us about your product, target audience, brand voice, and campaign goals.'
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  description: 'Our AI analyzes your inputs, market trends, and successful ad patterns in your industry.'
                },
                {
                  step: '03',
                  title: 'Content Generation',
                  description: 'Generate multiple ad variations with different angles, tones, and formats.'
                },
                {
                  step: '04',
                  title: 'Optimization & Testing',
                  description: 'Get recommendations for A/B testing and performance optimization strategies.'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
                      {step.title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className={`max-w-2xl mx-auto p-8 rounded-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700' 
              : 'bg-gradient-to-br from-white/80 to-slate-50/80 border border-slate-200'
          } backdrop-blur-sm`}>
            <h2 className={`text-3xl font-bold mb-4 ${textClass}`}>
              Ready to Transform Your Advertising?
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Start creating high-converting advertisements with our AI-powered Ad Agency agent.
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
