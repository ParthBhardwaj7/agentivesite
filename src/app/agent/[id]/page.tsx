'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';

interface AIAgent {
  id: string;
  name: string;
  department: string;
  status: string;
  performance: string;
  clients: string;
  description: string;
  videoTitle: string;
  videoDescription: string;
  capabilities: string[];
  icon: string;
  color: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load agents from localStorage
    const savedAgents = localStorage.getItem('nexusagents-ai-agents');
    if (savedAgents) {
      try {
        const parsedAgents = JSON.parse(savedAgents);
        const foundAgent = parsedAgents.find((a: AIAgent) => a.id === agentId);
        setAgent(foundAgent || null);
      } catch (error) {
        console.error('Error loading agent:', error);
      }
    } else {
      // Fallback to default agents if no localStorage data
      const defaultAgents = [
        {
          id: "marketing-agent",
          name: "Marketing AI Agent",
          department: "Marketing",
          status: "Active",
          performance: "98%",
          clients: "45+",
          description: "Creates and manages digital ads, analyzes campaign performance, and optimizes marketing strategies for maximum ROI.",
          videoTitle: "Marketing AI Agent Demo",
          videoDescription: "Watch our AI create and optimize Facebook ads in real-time",
          capabilities: ["Facebook Ads", "Google Ads", "Instagram Marketing", "Email Campaigns"],
          icon: "📈",
          color: "from-[#00BFFF] to-[#00FFB2]"
        },
        {
          id: "hr-agent",
          name: "HR AI Agent",
          department: "Human Resources",
          status: "Active",
          performance: "95%",
          clients: "32+",
          description: "Handles recruitment, employee onboarding, performance reviews, and HR documentation with intelligent automation.",
          videoTitle: "HR AI Agent Demo",
          videoDescription: "See how our AI screens resumes and schedules interviews",
          capabilities: ["Resume Screening", "Interview Scheduling", "Employee Portal", "Compliance Tracking"],
          icon: "👥",
          color: "from-[#00FFB2] to-[#00BFFF]"
        },
        {
          id: "customer-service-agent",
          name: "Customer Service AI",
          department: "Customer Service",
          status: "Active",
          performance: "99%",
          clients: "28+",
          description: "Provides 24/7 customer support, handles inquiries, resolves issues, and maintains customer satisfaction.",
          videoTitle: "Customer Service AI Demo",
          videoDescription: "Watch our AI handle customer inquiries in real-time",
          capabilities: ["Live Chat", "Email Support", "FAQ Management", "Escalation Handling"],
          icon: "🎧",
          color: "from-[#00BFFF] to-[#00FFB2]"
        }
      ];
      const foundAgent = defaultAgents.find(a => a.id === agentId);
      setAgent(foundAgent || null);
    }
    setLoading(false);
  }, [agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B0B0B0]">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#00BFFF] mb-4">Agent Not Found</h1>
          <p className="text-[#B0B0B0] mb-8">The requested agent could not be found.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-[#00BFFF] hover:bg-[#00BFFF]/80">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
              >
                ← Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] rounded-lg flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] bg-clip-text text-transparent">
                Nexusagents
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
              >
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-r ${agent.color} rounded-3xl flex items-center justify-center text-6xl shadow-2xl`}>
            {agent.icon}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] bg-clip-text text-transparent">
            {agent.name}
          </h1>
          <p className="text-2xl text-[#00FFB2] mb-4">{agent.department}</p>
          <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
            {agent.description}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-[#181818] border-[#333] p-6 text-center">
            <h3 className="text-3xl font-bold text-[#00FFB2]">{agent.performance}</h3>
            <p className="text-[#B0B0B0]">Performance</p>
          </Card>
          <Card className="bg-[#181818] border-[#333] p-6 text-center">
            <h3 className="text-3xl font-bold text-[#00BFFF]">{agent.clients}</h3>
            <p className="text-[#B0B0B0]">Happy Clients</p>
          </Card>
          <Card className="bg-[#181818] border-[#333] p-6 text-center">
            <h3 className="text-3xl font-bold text-[#00FFB2]">{agent.status}</h3>
            <p className="text-[#B0B0B0]">Status</p>
          </Card>
        </motion.div>

        {/* Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#00BFFF] mb-8 text-center">Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {agent.capabilities.map((capability, index) => (
              <Card key={index} className="bg-[#181818] border-[#333] p-6 hover:border-[#00BFFF]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-[#00FFB2] rounded-full"></div>
                  <span className="text-[#B0B0B0] text-lg">{capability}</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#00BFFF] mb-8 text-center">Demo Video</h2>
          <Card className="bg-[#181818] border-[#333] p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#00FFB2] mb-4">{agent.videoTitle}</h3>
              <p className="text-[#B0B0B0] mb-6">{agent.videoDescription}</p>
              <div className="w-full h-64 bg-[#0D0D0D] border border-[#333] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">▶️</span>
                  </div>
                  <p className="text-[#B0B0B0]">Video Demo Coming Soon</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button className="bg-gradient-to-r from-[#00BFFF] to-[#00FFB2] hover:from-[#00FFB2] hover:to-[#00BFFF] text-black font-bold px-8 py-4 text-lg">
            Get This Agent
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 