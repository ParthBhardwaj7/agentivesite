'use client';

import { motion } from 'framer-motion';

interface AboutUsProps {
  isDarkMode: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export default function AboutUs({ isDarkMode, isHovering, setIsHovering }: AboutUsProps) {
  const textClass = isDarkMode ? 'text-white' : 'text-orange-900';

  const services = [
    {
      icon: '🎯',
      title: 'Marketing AI Agents',
      description: 'Intelligent automation for digital marketing, content creation, and customer engagement strategies'
    },
    {
      icon: '👥',
      title: 'HR & Recruitment',
      description: 'AI-powered talent acquisition, employee management, and HR process optimization'
    },
    {
      icon: '💬',
      title: 'Customer Service',
      description: '24/7 intelligent customer support with natural language processing and problem resolution'
    },
    {
      icon: '📊',
      title: 'Business Operations',
      description: 'Streamlined workflow automation, data analysis, and operational efficiency solutions'
    }
  ];

  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6`}>
          About Agentive
        </h2>
        <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-slate-300' : 'text-orange-700'} max-w-4xl mx-auto mb-8`}>
          Leading the future of intelligent business automation
        </p>
      </motion.div>

      {/* Company Description */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="space-y-6">
          <h3 className={`text-3xl md:text-4xl font-bold ${textClass} mb-6`}>
            Who We Are
          </h3>
          <div className={`space-y-4 text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-orange-700'}`}>
            <p>
              <strong className={textClass}>Agentive</strong> is a pioneering AI solutions company that specializes in creating intelligent, domain-specific agents for businesses across various industries.
            </p>
            <p>
              We understand that every business has unique challenges and requirements. That's why we don't offer one-size-fits-all solutions. Instead, we develop customized AI agents that are specifically designed for your industry, your processes, and your goals.
            </p>
            <p>
              Our team combines deep expertise in artificial intelligence, machine learning, and business process optimization to deliver solutions that not only automate tasks but also enhance decision-making and drive measurable business outcomes.
            </p>
          </div>
        </div>

        <motion.div
          className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'} border-2 ${isDarkMode ? 'border-slate-700' : 'border-yellow-200'}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h4 className={`text-2xl font-bold ${textClass} mb-4`}>Our Mission</h4>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-orange-700'}`}>
            To democratize AI technology by making intelligent automation accessible, affordable, and effective for businesses of all sizes, while maintaining the highest standards of customization and quality.
          </p>
        </motion.div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className={`text-3xl md:text-4xl font-bold text-center ${textClass} mb-12`}>
          What We Deliver
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
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
              <div className="text-5xl mb-4">{service.icon}</div>
              <h4 className={`text-2xl font-bold mb-3 ${textClass}`}>
                {service.title}
              </h4>
              <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-yellow-100/50'} border-2 ${isDarkMode ? 'border-slate-700' : 'border-yellow-200'}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className={`text-3xl font-bold text-center ${textClass} mb-8`}>
          Why Businesses Choose Agentive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className={`text-xl font-semibold ${textClass} mb-2`}>Customized Solutions</h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Every AI agent is tailored to your specific business needs and industry requirements
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className={`text-xl font-semibold ${textClass} mb-2`}>Rapid Implementation</h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Quick deployment with minimal disruption to your existing operations
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📈</div>
            <h4 className={`text-xl font-semibold ${textClass} mb-2`}>Measurable Results</h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Clear metrics and ROI tracking to demonstrate the value of your investment
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 