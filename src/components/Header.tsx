'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: 'Services' },
  { label: 'Contact' },
  { label: 'About' },
];

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onContact: () => void;
  onAbout: () => void;
  onServices: () => void;
  onLogin: () => void;
  user: any;
  showLearnMore: boolean;
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export default function Header({ 
  isDarkMode, 
  setIsDarkMode, 
  onContact, 
  onAbout, 
  onServices, 
  onLogin, 
  user, 
  showLearnMore, 
  isHovering, 
  setIsHovering 
}: HeaderProps) {
  const { logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Scroll shrink effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown') && !target.closest('.mobile-menu')) {
        setShowUserDropdown(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme classes
  const textClass = isDarkMode ? 'text-white' : 'text-orange-900';
  const headerBgClass = isDarkMode ? 'bg-slate-900/80' : 'bg-white/80';
  const borderClass = isDarkMode ? 'border-slate-800' : 'border-slate-200';

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? `backdrop-blur-md ${headerBgClass} h-[60px]` : 'h-[80px]'
      } ${borderClass} border-b`}
      initial={false}
      animate={{ height: scrolled ? 60 : 80 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <motion.span 
              className={`font-black text-3xl ${textClass} tracking-tight bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Agentive
            </motion.span>
          </Link>
        </div>
        
        {/* Center: Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item, idx) => (
            <motion.button
              key={item.label}
              className={`relative px-2 py-1 ${textClass} text-lg transition group`}
              onClick={
                item.label === 'Contact' ? onContact : 
                item.label === 'About' ? onAbout : 
                item.label === 'Services' ? onServices : 
                undefined
              }
              whileHover={{ y: -2 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {item.label}
              <motion.span
                layoutId="underline"
                className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              />
            </motion.button>
          ))}
        </nav>
        
        {/* Right: Theme Toggle & Login */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center`}
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
          
          {user ? (
            <div className="relative user-dropdown">
              <motion.button
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block">{user.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Profile
                      </Link>
                      {user?.email === 'admin@agentive.ai' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition relative text-lg"
              onClick={openLoginModal}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Login
            </motion.button>
          )}
          
          {/* "Learn More →" appears after login */}
          <AnimatePresence>
            {showLearnMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute right-0 mt-16"
              >
                <motion.button
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg shadow-lg font-bold"
                  whileHover={{ x: 10 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Learn More →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Mobile Hamburger */}
        <button
          className={`md:hidden ${textClass} text-2xl`}
          onClick={() => setShowMobileMenu((v) => !v)}
        >
          ☰
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`md:hidden mobile-menu ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg absolute top-full left-0 w-full z-50 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
          >
            <nav className="flex flex-col gap-4 p-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className={`${textClass} text-left py-2 hover:text-yellow-600 transition-colors`}
                  onClick={() => {
                    if (item.label === 'Contact') onContact();
                    else if (item.label === 'About') onAbout();
                    else if (item.label === 'Services') onServices();
                    setShowMobileMenu(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow-lg mt-4"
                  onClick={() => {
                    openLoginModal();
                    setShowMobileMenu(false);
                  }}
                >
                  Login
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 