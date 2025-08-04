'use client';

import { Button } from "@/components/ui/button";

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] rounded-lg flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] bg-clip-text text-transparent">
                Nexusagents
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-[#B0B0B0] hover:text-[#00BFFF] transition-colors">Services</a>
              <a href="#about" className="text-[#B0B0B0] hover:text-[#00BFFF] transition-colors">About</a>
              <a href="#contact" className="text-[#B0B0B0] hover:text-[#00BFFF] transition-colors">Contact</a>
              <a href="/admin" className="text-[#B0B0B0] hover:text-[#00BFFF] transition-colors">Admin</a>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10">
                Login
              </Button>
              <Button className="bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] hover:from-[#00FFB2] hover:to-[#00BFFF] text-black font-bold">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/10 to-[#00FFB2]/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-[#0D0D0D] rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] bg-clip-text text-transparent">
            Nexusagents
          </h1>
          <p className="text-xl md:text-2xl text-[#B0B0B0] mb-8 max-w-3xl mx-auto">
            Revolutionary AI agents that transform your business operations with intelligent automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] hover:from-[#00FFB2] hover:to-[#00BFFF] text-black font-bold px-8 py-4 text-lg">
              Get Started
            </Button>
            <Button variant="outline" className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10 px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 