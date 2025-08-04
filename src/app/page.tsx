'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureHighlights from '@/components/FeatureHighlights';
import AboutUs from '@/components/AboutUs';
import AIAgents from '@/components/AIAgents';
import Footer from '@/components/Footer';
import Modals from '@/components/Modals';

import FloatingCursor from '@/components/FloatingCursor';

export default function HomePage() {
  // Theme state - always dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  
  // Auth context
  const { user, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [aiAgents, setAIAgents] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [contactMessages, setContactMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Remove "Learn More" section - no longer needed
  // useEffect(() => {
  //   if (user) setTimeout(() => setShowLearnMore(true), 600);
  //   else setShowLearnMore(false);
  // }, [user]);

  // Load data from API
  useEffect(() => {
    // Load AI agents from API
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAIAgents(data))
      .catch(err => console.error('Error loading agents:', err));

    // Load contact messages from API (for admin purposes)
    fetch('/api/contact-messages')
      .then(res => res.json())
      .then(data => setContactMessages(data))
      .catch(err => console.error('Error loading messages:', err));
  }, []);

  const handleContact = () => setShowContact(true);
  const handleAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServices = () => {
    const agentsSection = document.getElementById('agents');
    if (agentsSection) {
      agentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        setSubmitSuccess(true);
        setContactForm({ name: '', email: '', company: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        console.error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme classes with yellow effect for light mode
  const bgClass = isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100';

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-500`}>
      {/* Floating Cursor */}
      <FloatingCursor isDarkMode={isDarkMode} />
      
      {/* Header Component */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onContact={handleContact}
        onAbout={handleAbout}
        onServices={handleServices}
        onLogin={openLoginModal}
        user={user}
        showLearnMore={false}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

      {/* Hero Component */}
      <Hero
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        onGetStarted={handleServices}
      />

      {/* Feature Highlights Section */}
      <FeatureHighlights
        isDarkMode={isDarkMode}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

      {/* About Us Section */}
      <AboutUs
        isDarkMode={isDarkMode}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

      {/* AI Agents Section */}
      <AIAgents
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
      />

      {/* Footer Component */}
      <Footer
        isDarkMode={isDarkMode}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        onAbout={handleAbout}
      />

      {/* Modals Component */}
      <Modals
        showContact={showContact}
        setShowContact={setShowContact}
        isDarkMode={isDarkMode}
        contactForm={contactForm}
        setContactForm={setContactForm}
        isSubmitting={isSubmitting}
        handleContactSubmit={handleContactSubmit}
      />




    </div>
  );
}
