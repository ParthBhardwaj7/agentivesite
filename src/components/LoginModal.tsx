'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function LoginModal({ isOpen, onClose, isDarkMode }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, signup } = useAuth();

  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isSignUp) {
        result = await signup(
          formData.name.trim(), 
          formData.email.trim(), 
          formData.password, 
          formData.company.trim() || undefined
        );
      } else {
        result = await login(formData.email, formData.password);
      }
      
      if (result.success) {
        onClose();
        resetForm();
      } else {
        const errorMessage = result.error || `${isSignUp ? 'Signup' : 'Login'} failed`;
        const details = (result as any)?.details ? ` (${(result as any).details})` : '';
        setError(errorMessage + details);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: ''
    });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSocialLogin = (provider: 'google' | 'linkedin') => {
    // For now, just show a message
    setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-2xl rounded-xl md:rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Professional Header */}
            <div className={`px-4 sm:px-6 md:px-8 py-4 md:py-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    🤖
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${textClass}`}>Agentive</h1>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI-Powered Solutions</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
              {/* LOGIN SECTION */}
              <div className="mb-8">
                <h2 className={`text-xl md:text-2xl font-bold mb-2 ${textClass}`}>
                  {isSignUp ? 'Create your account' : 'Sign in to your account'}
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isSignUp ? 'Join Agentive to get started with our solutions.' : 'Welcome back! Please enter your details.'}
                </p>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <motion.button
                    type="button"
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-medium text-sm transition-all duration-200 ${isDarkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialLogin('google')}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-medium text-sm transition-all duration-200 ${isDarkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialLogin('linkedin')}
                  >
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>OR</span>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                        placeholder="Enter your full name"
                        required={isSignUp}
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass}`}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                        placeholder="Enter your company name"
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass}`}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                        placeholder={isSignUp ? "Create a password" : "Enter your password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                          placeholder="Confirm your password"
                          required={isSignUp}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                        >
                          {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isSignUp && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500" />
                        <span className={`ml-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Remember me</span>
                      </label>
                      <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'}`}
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 relative overflow-hidden"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {isSignUp ? 'Creating account...' : 'Signing in...'}
                      </div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign in'
                    )}
                  </motion.button>
                </form>

                {/* Toggle between login and signup */}
                <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isSignUp ? 'Already have an account?' : "Don&apos;t have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      resetForm();
                    }}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 