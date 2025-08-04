import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginModalProvider } from '@/contexts/LoginModalContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import GlobalLoginModal from '@/components/GlobalLoginModal';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentive - AI-Powered Solutions",
  description: "Transform your business with AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SettingsProvider>
            <LoginModalProvider>
              {children}
              <GlobalLoginModal />
            </LoginModalProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
