'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Agent {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  photo_url?: string;
  key_value?: string;
  features?: string;
}

interface AIAgentsProps {
  isDarkMode: boolean;
  isMobile: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export default function AIAgents({ isDarkMode, isMobile, isHovering, setIsHovering }: AIAgentsProps) {
  const router = useRouter();
  const textClass = isDarkMode ? 'text-white' : 'text-orange-900';
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgents = () => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading agents:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // Refresh data when page becomes visible (for real-time updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAgents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleGoClick = (agentId: number) => {
    router.push(`/agents/${agentId}`);
  };

  const handleAgentClick = (agentId: number) => {
    router.push(`/agents/${agentId}`);
  };

  return (
    <section id="agents" className="py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-4 md:mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4 md:mb-6`}>
          Your AI Team
        </h2>
                   <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-orange-700'} max-w-4xl mx-auto mb-6 md:mb-8 px-4`}>
             Discover our portfolio of specialized AI agents designed for different business domains. Each agent is customized to deliver maximum efficiency and results for your specific industry needs.
           </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active ({agents.filter(a => a.status === 'active').length})
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Ready to Launch ({agents.filter(a => a.status === 'ready').length})
          </span>
          <button
            onClick={loadAgents}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh agents"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Agents Grid */}
      {loading ? (
        <div className="flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Loading agents...</p>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            No Agents Available
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-md mx-auto`}>
            Our AI agents are being prepared. Check back soon to explore our powerful automation solutions!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {agents.map((agent, index) => (
      <motion.div
              key={agent.id}
              className={`w-full rounded-2xl shadow-2xl p-6 md:p-8 cursor-pointer ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700' 
            : 'bg-gradient-to-br from-white/80 to-slate-50/80 border border-slate-200'
              } backdrop-blur-sm hover:shadow-3xl transition-all duration-300`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onClick={() => handleAgentClick(agent.id)}
            >
              
              {/* Agent Icon/Photo */}
          <motion.div
            className="flex justify-center mb-4 md:mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
                {agent.photo_url ? (
                  <div className="relative">
                    <img 
                      src={agent.photo_url} 
                      alt={agent.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-lg border-4 border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                        : 'bg-gradient-to-br from-blue-100 to-purple-100'
                    } flex items-center justify-center text-4xl shadow-lg border-4 border-white/20 hidden`}>
                      🤖
                    </div>
                  </div>
                ) : (
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  } flex items-center justify-center text-4xl shadow-lg border-4 border-white/20`}>
                    🤖
            </div>
                )}
          </motion.div>

          {/* Agent Title */}
              <h3 className={`text-xl md:text-2xl font-bold text-center mb-2 ${textClass}`}>
                {agent.name}
          </h3>

              {/* Agent Type Badge */}
              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  isDarkMode 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {agent.type}
                </span>
              </div>

          {/* Agent Description */}
              <p className={`text-center mb-6 leading-relaxed text-sm ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
                {agent.description || 'AI agent for automation and business intelligence'}
              </p>

              {/* Key Value */}
              {agent.key_value && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-200/30">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-center font-semibold text-sm ${
                      isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                    }`}>
                      {agent.key_value}
                    </p>
                  </div>
                </div>
              )}

          {/* Features List */}
              <div className="mb-8">
                <h4 className={`text-sm font-semibold mb-3 text-center ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  Key Features
                </h4>
                <div className="space-y-2">
                  {agent.features ? (
                    agent.features.split(',').slice(0, 4).map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * featureIndex }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"></div>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {feature.trim()}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    // Default features
                    ['AI-powered automation', 'Smart decision making', '24/7 availability', 'Scalable solutions'].map((feature, featureIndex) => (
              <motion.div
                        key={featureIndex}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * featureIndex }}
                viewport={{ once: true }}
              >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"></div>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {feature}
                </span>
              </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : agent.status === 'ready'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {agent.status === 'active' ? '🟢 Active' : 
                   agent.status === 'ready' ? '🔵 Ready to Launch' : 
                   '⚪ Inactive'}
                </span>
          </div>

          {/* Go Button */}
          <motion.button
                onClick={() => handleGoClick(agent.id)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
                <span className="relative z-10 text-lg flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Launch Agent
                </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
