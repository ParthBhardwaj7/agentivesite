'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface FooterProps {
  isDarkMode: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
  onAbout?: () => void;
}

export default function Footer({ isDarkMode, isHovering, setIsHovering, onAbout }: FooterProps) {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const footerLinks = {
    product: [
      { name: 'AI Agents', href: '#agents' },
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Demo', href: '#demo' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: '#contact' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Community', href: '#community' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', href: '#twitter' },
    { name: 'LinkedIn', icon: '💼', href: '#linkedin' },
    { name: 'GitHub', icon: '🐙', href: '#github' },
    { name: 'Discord', icon: '💬', href: '#discord' }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowNotification(true);
        setEmail('');
      } else {
        // Show error notification
        alert(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  return (
    <footer className={`relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100'
    } border-t ${isDarkMode ? 'border-slate-700' : 'border-yellow-200'}`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  🤖
                </motion.div>
                <h3 className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent`}>
                  Agentive
                </h3>
              </div>
              
              <p className={`text-sm leading-relaxed mb-4 md:mb-6 ${
                isDarkMode ? 'text-slate-300' : 'text-orange-700'
              }`}>
                Agentive specializes in domain-specific AI agent solutions. We deliver customized intelligent automation for marketing, HR, customer service, and business operations across multiple industries.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:text-yellow-600 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:text-yellow-600 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                      onClick={(e) => {
                        if (link.name === 'About Us' && onAbout) {
                          e.preventDefault();
                          onAbout();
                        }
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Support Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:text-blue-500 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Legal Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:text-blue-500 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Contact
              </h4>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className={`text-sm transition-colors duration-200 hover:text-yellow-600 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    📧 {settings.contactEmail}
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    🌍 Available 24/7
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className={`p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-slate-700' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div>
              <h4 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Stay Updated
              </h4>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Stay updated with the latest AI agent solutions, industry insights, and automation trends from Agentive.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full sm:flex-1 md:w-64 px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
                required
              />
              <motion.button
                type="submit"
                disabled={isSubscribing}
                className={`bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 ${
                  isSubscribing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!isSubscribing ? { scale: 1.05 } : {}}
                whileTap={!isSubscribing ? { scale: 0.95 } : {}}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
                isDarkMode 
                  ? 'bg-green-900/90 border-green-700 text-green-100' 
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold">Thank you!</div>
                  <div className="text-sm">Our team will soon contact you.</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar */}
        <motion.div
          className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            © {currentYear} Agentive. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Made with ❤️ for the future of AI
            </span>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                All systems operational
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
