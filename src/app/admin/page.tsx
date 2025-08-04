'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import VideoPlayer from '@/components/VideoPlayer';
import FloatingCursor from '@/components/FloatingCursor';

interface Agent {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  photo_url?: string;
  key_value?: string;
  features?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: string;
  created_at: string;
}

interface Subscription {
  id: number;
  email: string;
  status: string;
  created_at: string;
}

interface AgentVideo {
  id: number;
  agent_id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  created_at: string;
  agent_name?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [section, setSection] = useState<'agents' | 'messages' | 'videos' | 'settings'>('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Ensure agents is always an array
  const safeAgents = Array.isArray(agents) ? agents : [];
  const [newAgent, setNewAgent] = useState<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    type: 'marketing',
    description: '',
    status: 'active',
    photo_url: '',
    key_value: '',
    features: 'AI-Powered Automation, 24/7 Availability, Custom Integration, Real-time Analytics, Multi-language Support, Scalable Solution'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [videos, setVideos] = useState<AgentVideo[]>([]);
  const [selectedAgentForVideo, setSelectedAgentForVideo] = useState<number | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<AgentVideo, 'id' | 'created_at'>>({
    agent_id: 0,
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: 'Agentive AI Solutions',
    contactEmail: 'hello@agentive.com'
  });

  // Check admin access
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    // Only allow admin@agentive.ai to access admin panel
    if (user.email !== 'admin@agentive.ai') {
      alert('Access Denied: Only admin users can access this panel.');
      router.push('/');
      return;
    }
    
    setIsAuthorized(true);
  }, [user, router]);

  // Load agents from API
  useEffect(() => {
    fetch('/api/agents')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch agents');
        }
        return res.json();
      })
      .then(data => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          console.error('Agents data is not an array:', data);
          setAgents([]);
          setError('Invalid data format received');
        }
      })
      .catch(err => {
        console.error('Error loading agents:', err);
        setAgents([]);
        setError('Failed to load agents');
      });
  }, []);

  // Load messages from API
  useEffect(() => {
    fetch('/api/contact-messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => setError('Failed to load messages'));
  }, []);

  // Load subscriptions from API
  useEffect(() => {
    fetch('/api/subscriptions')
      .then(res => res.json())
      .then(data => setSubscriptions(data))
      .catch(err => setError('Failed to load subscriptions'));
  }, []);

  // Load videos from API
  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => setError('Failed to load videos'));
  }, []);

  // Load settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const settingsMap = data.reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});
        
        setSettings({
          siteTitle: settingsMap.siteTitle || 'Agentive AI Solutions',
          contactEmail: settingsMap.contactEmail || 'hello@agentive.com'
        });
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const handleAgentChange = (field: keyof Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAgent(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addAgent = () => {
    if (!newAgent.name.trim() || !newAgent.type.trim()) {
      setError('Name and Type are required fields');
      return;
    }
    
    fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgent)
    })
      .then(res => res.json())
      .then(addedAgent => {
        setAgents([...safeAgents, addedAgent]);
        setNewAgent({
          name: '',
          type: 'marketing',
          description: '',
          status: 'active',
          photo_url: '',
          key_value: '',
          features: 'AI-Powered Automation, 24/7 Availability, Custom Integration, Real-time Analytics, Multi-language Support, Scalable Solution'
        });
        setError(null);
        setSuccess('Agent added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch(err => setError('Failed to add agent'));
  };

  const startEditing = (agent: Agent) => {
    setEditingAgent(agent);
    setNewAgent({
      name: agent.name,
      type: agent.type,
      description: agent.description || '',
      status: agent.status,
      photo_url: agent.photo_url || '',
      key_value: agent.key_value || '',
      features: agent.features || ''
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setEditingAgent(null);
    setIsEditing(false);
    setNewAgent({
      name: '',
      type: 'marketing',
      description: '',
      status: 'active',
      photo_url: '',
      key_value: '',
      features: 'AI-Powered Automation, 24/7 Availability, Custom Integration, Real-time Analytics, Multi-language Support, Scalable Solution'
    });
    setError(null);
  };

  const updateAgent = () => {
    if (!editingAgent || !newAgent.name.trim() || !newAgent.type.trim()) {
      setError('Name and Type are required fields');
      return;
    }
    
    fetch(`/api/agents/${editingAgent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgent)
    })
      .then(res => res.json())
      .then(updatedAgent => {
        const updatedAgents = safeAgents.map(agent => 
          agent.id === editingAgent.id ? updatedAgent : agent
        );
        setAgents(updatedAgents);
        cancelEditing();
        setError(null);
        setSuccess('Agent updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch(err => setError('Failed to update agent'));
  };

  const deleteAgent = (agentId: number) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            const updatedAgents = safeAgents.filter(agent => agent.id !== agentId);
            setAgents(updatedAgents);
            setError(null);
            setSuccess('Agent deleted successfully!');
            setTimeout(() => setSuccess(null), 3000);
          } else {
            throw new Error('Failed to delete agent');
          }
        })
        .catch(err => setError('Failed to delete agent'));
    }
  };

  const markAsRead = (id: number) => {
    fetch('/api/contact-messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'read' })
    })
      .then(() => {
    const updatedMessages = messages.map(msg => 
          msg.id === id ? { ...msg, status: 'read' } : msg
    );
    setMessages(updatedMessages);
      })
      .catch(err => setError('Failed to update message status'));
  };

  const deleteSubscription = (id: number) => {
    fetch(`/api/subscriptions/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setSuccess('Subscription deleted successfully');
    })
    .catch(err => setError('Failed to delete subscription'));
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.video_url || !newVideo.agent_id) {
      setError('Title, video URL, and agent are required');
      return;
    }

    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVideo)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setVideos(prev => [data, ...prev]);
        setNewVideo({
          agent_id: 0,
          title: '',
          description: '',
          video_url: '',
          thumbnail_url: ''
        });
        setSuccess('Video added successfully');
      } else {
        setError(data.error || 'Failed to add video');
      }
    })
    .catch(err => setError('Failed to add video'));
  };

  const deleteVideo = (id: number) => {
    fetch(`/api/videos/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setVideos(prev => prev.filter(v => v.id !== id));
      setSuccess('Video deleted successfully');
    })
    .catch(err => setError('Failed to delete video'));
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

                 // Validate file size (2GB limit)
             if (file.size > 2 * 1024 * 1024 * 1024) {
               setError('Video file size must be less than 2GB');
               return;
             }

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setNewVideo(prev => ({ ...prev, video_url: data.url }));
        setSuccess('Video uploaded successfully!');
      } else {
        setError(data.error || 'Failed to upload video');
      }
    } catch (error) {
      setError('Failed to upload video');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setNewAgent(prev => ({ ...prev, photo_url: result.url }));
      setUploadProgress(100);
      
      // Reset progress after a moment
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const saveSettings = async () => {
    try {
      // Save site title
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'siteTitle',
          value: settings.siteTitle,
          description: 'Site title displayed in header and meta tags'
        })
      });

      // Save contact email
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'contactEmail',
          value: settings.contactEmail,
          description: 'Primary contact email for the website'
        })
      });

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save settings');
    }
  };

  // Show loading while checking authorization
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Floating Cursor */}
      <FloatingCursor isDarkMode={isDarkMode} />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 shadow-sm">
          <div className="p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <nav className="flex-1">
            {['Agents', 'Messages', 'Videos', 'Settings'].map(item => (
              <button
                key={item}
                onClick={() => {
                  setSection(item.toLowerCase() as any);
                  setError(null);
                }}
                className={`w-full text-left p-3 hover:bg-slate-700 flex items-center ${
                  section === item.toLowerCase() 
                    ? 'bg-blue-600 text-white border-l-4 border-blue-400' 
                    : 'text-slate-300'
                }`}
              >
                <span className="ml-2">{item}</span>
              </button>
            ))}
          </nav>
        </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Topbar */}
        <div className="bg-slate-800 border-b border-slate-700 h-16 flex items-center px-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            {section === 'agents' && `Manage AI Agents (${safeAgents.length})`}
            {section === 'messages' && `Client Messages (${messages.filter(m => m.status === 'new').length})`}
            {section === 'settings' && 'Site Settings'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900">
          {/* Error and Success handling */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          ⚠️ {error}
        </div>
      )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              ✅ {success}
            </div>
          )}

      {/* Agents Section */}
      {section === 'agents' && (
        <div className="space-y-6">
          <div className="border rounded-xl p-5 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">
                    {isEditing ? `Edit Agent: ${editingAgent?.name}` : 'Add New AI Agent'}
                  </h3>
                  {isEditing && (
                    <button
                      onClick={cancelEditing}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  )}
                </div>
                
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                    <label className="block text-sm font-medium mb-1">Agent Name *</label>
                <input 
                      value={newAgent.name}
                      onChange={handleAgentChange('name')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Marketing Agent"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium mb-1">Agent Type *</label>
                    <select 
                      value={newAgent.type}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="support">Customer Support</option>
                      <option value="analytics">Analytics</option>
                      <option value="automation">Automation</option>
                      <option value="content">Content Creation</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status *</label>
                    <select 
                      value={newAgent.status}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="active">🟢 Active</option>
                      <option value="ready">🔵 Ready to Launch</option>
                      <option value="inactive">⚪ Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Order</label>
                <input 
                      type="number"
                      min="1"
                      placeholder="1"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Agent Photo</label>
                  
                  {/* File Upload Section */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 mb-3 transition-colors ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="photo-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                          uploading 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Photo
                          </>
                        )}
                      </label>
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Drag & drop an image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* URL Input (Alternative) */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Or enter photo URL:</label>
                    <input 
                      value={newAgent.photo_url}
                      onChange={handleAgentChange('photo_url')}
                      placeholder="https://example.com/agent-photo.jpg"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Preview */}
                  {newAgent.photo_url && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-gray-600">Preview:</label>
                        <button
                          type="button"
                          onClick={() => setNewAgent(prev => ({ ...prev, photo_url: '' }))}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="w-20 h-20 rounded-lg overflow-hidden border">
                        <img 
                          src={newAgent.photo_url} 
                          alt="Agent preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                />
              </div>
            </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="AI agent for marketing automation and lead generation"
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Key Value Proposition</label>
              <input 
                    value={newAgent.key_value}
                    onChange={handleAgentChange('key_value')}
                    placeholder="Saves 200+ hours per month"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
                  <textarea 
                    value={newAgent.features}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="AI-powered automation, Smart decision making, 24/7 availability, Scalable solutions"
                    rows={2}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate features with commas. Default features are pre-filled for new agents.</p>
            </div>

                <div className="flex space-x-3">
                  <button 
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isEditing 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={isEditing ? updateAgent : addAgent}
                  >
                    {isEditing ? '✓ Update Agent' : '+ Add Agent'}
                  </button>
                  {isEditing && (
            <button 
                      className="px-6 py-3 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600"
                      onClick={cancelEditing}
            >
                      Cancel
            </button>
                  )}
                </div>
          </div>

          {/* Client View Preview */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Client View Preview</h3>
            <div className="border rounded-xl overflow-hidden bg-gray-50">
              <div className="bg-emerald-500/10 text-emerald-400 text-center py-1.5 text-sm">
                ✅ {agents.length} Agents Active • Last Update: 2 mins ago
              </div>
              
              <div className="p-6">
                    {safeAgents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No agents added yet. Add one to see preview.
                  </div>
                ) : (
                      safeAgents.map(agent => (
                    <div key={agent.id} className="border-b last:border-0 pb-6 last:pb-0 mb-6 last:mb-0">
                      <div className="flex items-center space-x-4 mb-4">
                            {agent.photo_url ? (
                              <img 
                                src={agent.photo_url} 
                                alt={agent.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white ${agent.photo_url ? 'hidden' : ''}`}>
                              🤖
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{agent.name}</h3>
                              <p className="text-sm text-gray-500 capitalize">{agent.type}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{agent.description || 'AI agent for automation and business intelligence'}</p>
                          {agent.key_value && (
                            <div className="bg-blue-50 p-3 rounded mb-4 border border-blue-200">
                              <p className="text-sm font-medium text-blue-700">{agent.key_value}</p>
                            </div>
                          )}
                          {agent.features && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                              <div className="flex flex-wrap gap-2">
                                {agent.features.split(',').map((feature, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                    {feature.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                                                     <div className="bg-gray-100 p-3 rounded text-center font-medium mb-4">
                             Status: {agent.status}
                      </div>
                           
                           {/* Action Buttons */}
                           <div className="flex space-x-2">
                             <button
                               onClick={() => startEditing(agent)}
                               className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                             >
                               <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                               </svg>
                               Edit
                             </button>
                             <button
                               onClick={() => deleteAgent(agent.id)}
                               className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                             >
                               <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
                               Delete
                             </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Messages Section */}
      {section === 'messages' && (
        <div className="space-y-6">
          {/* Contact Messages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Messages</h3>
            <div className="flex mb-4 space-x-4">
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                New ({messages.filter(m => m.status === 'new').length})
              </button>
              <button className="px-3 py-1 border rounded">
                All ({messages.length})
              </button>
            </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back later!</p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`border rounded-xl p-4 ${message.status === 'new' ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-gray-500">{message.email}</p>
                    {message.company && (
                      <p className="text-sm text-gray-400">{message.company}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => markAsRead(message.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      message.status === 'read'
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {message.status === 'read' ? 'Read' : 'Mark as Read'}
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{message.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
          </div>

          {/* Subscriptions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter Subscriptions ({subscriptions.length})</h3>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No subscriptions yet</p>
                <p className="text-sm text-gray-400 mt-1">Check back later!</p>
              </div>
            ) : (
              subscriptions.map(subscription => (
                <div 
                  key={subscription.id} 
                  className="border rounded-xl p-4 mb-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{subscription.email}</p>
                      <p className="text-xs text-gray-400">
                        Subscribed on {new Date(subscription.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteSubscription(subscription.id)}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {section === 'videos' && (
        <div className="space-y-6">
          {/* Add New Video */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Agent
                </label>
                <select
                  value={newVideo.agent_id}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, agent_id: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Select an agent...</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Upload
                </label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a video</span>
                          <input 
                            id="video-upload" 
                            name="video-upload" 
                            type="file" 
                            className="sr-only" 
                            accept="video/*"
                            onChange={handleVideoUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI up to 2GB</p>
                    </div>
                  </div>
                  
                  {/* URL Input (Alternative) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Enter Video URL
                    </label>
                    <input
                      type="url"
                      value={newVideo.video_url}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={newVideo.thumbnail_url}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={addVideo}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Video
                </button>
              </div>
            </div>
          </div>

          {/* Videos List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Videos ({videos.length})</h3>
            {videos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No videos yet</p>
                <p className="text-sm text-gray-400 mt-1">Add videos to showcase your agents</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map(video => (
                  <div key={video.id} className="border rounded-xl p-4 bg-white shadow-sm">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {video.video_url ? (
                        <VideoPlayer
                          src={video.video_url}
                          poster={video.thumbnail_url}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-4xl">🎥</div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{video.title}</h4>
                    <p className="text-xs text-blue-600 mb-2">Agent: {video.agent_name}</p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Section */}
      {section === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Site Title</label>
            <input 
              value={settings.siteTitle}
              onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input 
              value={settings.contactEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <button 
            onClick={saveSettings}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}