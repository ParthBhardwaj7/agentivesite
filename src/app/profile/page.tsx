'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginModal } from '@/contexts/LoginModalContext';
import { motion } from 'framer-motion';
import FloatingCursor from '@/components/FloatingCursor';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setName(user.name || '');
    setCompany(user.company || '');
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    const result = await updateProfile(name.trim(), company.trim() || undefined);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100'}`}>
      {/* Floating Cursor */}
      <FloatingCursor isDarkMode={isDarkMode} />
      
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-yellow-200'} backdrop-blur-md shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Agentive
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} font-medium`}>
                Home
              </Link>
              <button
                onClick={handleLogout}
                className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} font-medium`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">Your Profile</h1>
            <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} max-w-2xl mx-auto`}>Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className={`${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-yellow-200'} backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2`}>
            {/* Error and Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
              >
                {success}
              </motion.div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                                 <input
                   type="email"
                   value={user.email}
                   disabled
                   className={`w-full px-4 py-3 border rounded-lg cursor-not-allowed ${
                     isDarkMode 
                       ? 'bg-slate-700 border-slate-600 text-slate-400' 
                       : 'bg-gray-50 border-gray-300 text-gray-500'
                   }`}
                 />
                 <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Email cannot be changed</p>
              </div>

              {/* Name */}
                             <div>
                 <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                   Full Name *
                 </label>
                 <input
                   id="name"
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   disabled={!isEditing}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                     isDarkMode 
                       ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                       : 'border-gray-300'
                   } ${
                     !isEditing ? (isDarkMode ? 'bg-slate-800 cursor-not-allowed' : 'bg-gray-50 cursor-not-allowed') : ''
                   }`}
                   placeholder="Enter your full name"
                   required
                 />
               </div>

              {/* Company */}
                             <div>
                 <label htmlFor="company" className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                   Company
                 </label>
                 <input
                   id="company"
                   type="text"
                   value={company}
                   onChange={(e) => setCompany(e.target.value)}
                   disabled={!isEditing}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                     isDarkMode 
                       ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                       : 'border-gray-300'
                   } ${
                     !isEditing ? (isDarkMode ? 'bg-slate-800 cursor-not-allowed' : 'bg-gray-50 cursor-not-allowed') : ''
                   }`}
                   placeholder="Enter your company name"
                 />
               </div>

              {/* Account Info */}
                             <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                 <div>
                   <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                     Account Created
                   </label>
                   <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                     {new Date(user.created_at).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric'
                     })}
                   </p>
                 </div>
                 
                 <div>
                   <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                     Last Login
                   </label>
                   <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                     {user.last_login 
                       ? new Date(user.last_login).toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit'
                         })
                       : 'Never'
                     }
                   </p>
                 </div>
               </div>

              {/* Action Buttons */}
                             <div className={`flex justify-end space-x-4 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name || '');
                        setCompany(user.company || '');
                        setError('');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 rounded-lg text-white transition-colors ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                      }`}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Additional Actions */}
                     <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className={`${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-yellow-200'} backdrop-blur-md rounded-2xl shadow-xl p-6 border`}>
               <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
               <div className="space-y-3">
                                  {user?.email === 'admin@agentive.ai' && (
                    <Link
                      href="/admin"
                      className={`block w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'border-slate-600 hover:bg-slate-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Admin Panel</span>
                      </div>
                    </Link>
                  )}
               </div>
             </div>

             <div className={`${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-yellow-200'} backdrop-blur-md rounded-2xl shadow-xl p-6 border`}>
               <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Account Status</h3>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Email Verified</span>
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                     user.is_verified 
                       ? 'bg-green-100 text-green-700' 
                       : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {user.is_verified ? 'Verified' : 'Pending'}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Account Type</span>
                   <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Standard</span>
                 </div>
               </div>
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
} 