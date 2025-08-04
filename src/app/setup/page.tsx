'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const setupDefaultUser = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test if admin user already exists
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@agentive.ai',
          password: 'admin123'
        }),
      });

      if (loginResponse.ok) {
        setResult({
          success: true,
          message: 'Default admin user is already set up and working!'
        });
      } else {
        setError('Admin user not found. Please contact support.');
      }
    } catch (err) {
      setError('Network error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100'} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-8`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Setup Default User</h1>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Create a default admin account for testing</p>
        </div>

        {!result && (
          <button
            onClick={setupDefaultUser}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Create Default User'}
          </button>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Setup Complete!</h3>
              <p className="text-green-700">{result.message}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Login Credentials</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">admin@agentive.ai</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Password:</span>
                  <span className="ml-2 text-gray-900">admin123</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Go to Homepage
              </a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 