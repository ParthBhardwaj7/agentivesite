'use client';

import { useLoginModal } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import { useState } from 'react';

export default function GlobalLoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      isDarkMode={isDarkMode}
    />
  );
} 