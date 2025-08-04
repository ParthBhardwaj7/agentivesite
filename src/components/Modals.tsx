'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ModalsProps {
  showContact: boolean;
  setShowContact: (value: boolean) => void;
  isDarkMode: boolean;
  contactForm: {
    name: string;
    email: string;
    company: string;
    message: string;
  };
  setContactForm: (value: any) => void;
  isSubmitting: boolean;
  handleContactSubmit: (e: React.FormEvent) => void;
}

export default function Modals({
  showContact,
  setShowContact,
  isDarkMode,
  contactForm,
  setContactForm,
  isSubmitting,
  handleContactSubmit
}: ModalsProps) {
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <>
      {/* CONTACT MODAL */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 border`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textClass}`}>Contact Us</h2>
                <button
                  onClick={() => setShowContact(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textClass}`}>Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textClass}`}>Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textClass}`}>Company</label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textClass}`}>Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none`}
                    placeholder="Tell us about your project..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContact(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
