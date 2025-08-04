'use client';

import { motion } from 'framer-motion';

interface FeatureHighlightsProps {
  isDarkMode: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export default function FeatureHighlights({ isDarkMode, isHovering, setIsHovering }: FeatureHighlightsProps) {
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  
               const features = [
               {
                 icon: '⚡',
                 title: 'Domain Expertise',
                 description: 'Specialized AI agents for marketing, HR, customer service, and business operations'
               },
               {
                 icon: '🔄',
                 title: 'Custom Solutions',
                 description: 'Tailored automation that adapts to your specific business requirements'
               },
               {
                 icon: '🎯',
                 title: '24/7 Efficiency',
                 description: 'Intelligent agents that work continuously without breaks or downtime'
               },
               {
                 icon: '🚀',
                 title: 'Scalable Growth',
                 description: 'AI solutions that grow with your business and handle increasing workloads'
               }
             ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
                           <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
                     Why Choose Agentive?
                   </h2>
                   <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mx-auto`}>
                     We specialize in domain-specific AI solutions with customized automation that adapts to your unique business needs
                   </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`p-8 rounded-3xl border-2 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700 hover:border-yellow-500/50' 
                : 'bg-yellow-50/50 border-yellow-200 hover:border-yellow-400'
            } hover:shadow-2xl hover:scale-105`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="text-6xl mb-4">{feature.icon}</div>
            <h3 className={`text-2xl font-bold mb-3 ${textClass}`}>
              {feature.title}
            </h3>
            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'}`}>
          <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            99.9%
          </div>
          <div className={`text-xl font-semibold ${textClass}`}>
            Uptime
          </div>
        </div>
        <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'}`}>
          <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            24/7
          </div>
          <div className={`text-xl font-semibold ${textClass}`}>
            Availability
          </div>
        </div>
        <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'}`}>
          <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            10x
          </div>
          <div className={`text-xl font-semibold ${textClass}`}>
            Faster
          </div>
        </div>
      </motion.div>
    </section>
  );
} 