import Database from 'better-sqlite3';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'nexusagents.db');

// Initialize database
export function initDatabase() {
  const db = new Database(dbPath);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT,
      company TEXT,
      provider TEXT DEFAULT 'email',
      provider_id TEXT,
      avatar_url TEXT,
      is_verified BOOLEAN DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      config TEXT,
      photo_url TEXT,
      key_value TEXT,
      features TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      agent_id INTEGER,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (agent_id) REFERENCES ai_agents (id)
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES ai_agents (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add missing columns to existing ai_agents table if they don't exist
  try {
    db.exec(`
      ALTER TABLE ai_agents ADD COLUMN photo_url TEXT;
    `);
  } catch (error) {
    // Column already exists, ignore error
  }

  try {
    db.exec(`
      ALTER TABLE ai_agents ADD COLUMN key_value TEXT;
    `);
  } catch (error) {
    // Column already exists, ignore error
  }

  try {
    db.exec(`
      ALTER TABLE ai_agents ADD COLUMN features TEXT;
    `);
  } catch (error) {
    // Column already exists, ignore error
  }

  // Insert default services
  const services = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  if (services.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (name, description, icon, color) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertService.run('Custom AI Agents', 'Tailored AI agents for automation, support, and business intelligence', '🤖', '#00BFFF');
    insertService.run('Conversational Bots', 'Smart chatbots for customer engagement and lead generation', '💬', '#00FFB2');
    insertService.run('Agent Integrations', 'Seamless integration of AI agents with your existing tools', '🔗', '#00BFFF');
  }

  // Insert default agent
  const agents = db.prepare('SELECT COUNT(*) as count FROM ai_agents').get() as { count: number };
  if (agents.count === 0) {
    const insertAgent = db.prepare(`
      INSERT INTO ai_agents (user_id, name, type, description, photo_url, key_value, features, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertAgent.run(
      1, 
      'Ad Agency', 
      'marketing', 
      'Create customized advertisements for your products based on your preferences. Our AI analyzes your brand, target audience, and goals to generate compelling ad content that converts.',
      '',
      'Saves 200+ hours per month',
      'Custom ad copy generation, Brand-aligned messaging, Multi-platform optimization, A/B testing suggestions',
      'active'
    );
  }

  return db;
}

// Database instance
let db: Database.Database;

export function getDatabase() {
  if (!db) {
    db = initDatabase();
  }
  return db;
}

// User operations
export const userOperations = {
  // Create user with email/password
  create: (email: string, name: string, password?: string, company?: string) => {
    try {
      const db = getDatabase();
      console.log('Creating user in database:', { email, name, company, hasPassword: !!password });
      const stmt = db.prepare('INSERT INTO users (email, name, password, company, provider) VALUES (?, ?, ?, ?, ?)');
      const result = stmt.run(email, name, password, company, 'email');
      console.log('User creation database result:', result);
      return result;
    } catch (error) {
      console.error('Database user creation error:', error);
      throw error;
    }
  },

  // Create user with social provider
  createWithProvider: (email: string, name: string, provider: string, providerId: string, avatarUrl?: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO users (email, name, provider, provider_id, avatar_url, is_verified) VALUES (?, ?, ?, ?, ?, 1)');
    return stmt.run(email, name, provider, providerId, avatarUrl);
  },

  // Get user by email
  getByEmail: (email: string) => {
    try {
      const db = getDatabase();
      console.log('Looking up user by email:', email);
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const result = stmt.get(email);
      console.log('User lookup result:', result ? 'User found' : 'No user found');
      return result;
    } catch (error) {
      console.error('Database user lookup error:', error);
      throw error;
    }
  },

  // Get user by provider ID
  getByProviderId: (provider: string, providerId: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?');
    return stmt.get(provider, providerId);
  },

  // Update last login
  updateLastLogin: (userId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(userId);
  },

  // Verify user
  verifyUser: (userId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE users SET is_verified = 1 WHERE id = ?');
    return stmt.run(userId);
  },

  // Get all users
  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    return stmt.all();
  },

  // Get user by ID
  getById: (id: number) => {
    try {
      const db = getDatabase();
      console.log('Looking up user by ID:', id);
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const result = stmt.get(id);
      console.log('User ID lookup result:', result ? 'User found' : 'No user found');
      return result;
    } catch (error) {
      console.error('Database user ID lookup error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: (id: number, data: { name?: string; company?: string }) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE users SET name = ?, company = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(data.name, data.company, id);
  }
};

// AI Agent operations
export const agentOperations = {
  create: (userId: number, name: string, type: string, description?: string, config?: string, photoUrl?: string, keyValue?: string, features?: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO ai_agents (user_id, name, type, description, config, photo_url, key_value, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    return stmt.run(userId, name, type, description, config, photoUrl, keyValue, features);
  },

  getByUser: (userId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM ai_agents WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  getAll: () => {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM ai_agents ORDER BY created_at DESC');
      const result = stmt.all();
      console.log('Database agents result:', result);
      return result;
    } catch (error) {
      console.error('Error getting agents from database:', error);
      return [];
    }
  },

  update: (id: number, data: { name?: string; type?: string; description?: string; config?: string; photoUrl?: string; keyValue?: string; features?: string; status?: string }) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE ai_agents SET name = ?, type = ?, description = ?, config = ?, photo_url = ?, key_value = ?, features = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(data.name, data.type, data.description, data.config, data.photoUrl, data.keyValue, data.features, data.status, id);
  },

  delete: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM ai_agents WHERE id = ?');
    return stmt.run(id);
  },

  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM ai_agents WHERE id = ?');
    return stmt.get(id);
  }
};

// Service operations
export const serviceOperations = {
  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY id');
    return stmt.all();
  },

  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
    return stmt.get(id);
  }
};

// Conversation operations
export const conversationOperations = {
  create: (userId: number, agentId: number, message: string, response: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO conversations (user_id, agent_id, message, response) VALUES (?, ?, ?, ?)');
    return stmt.run(userId, agentId, message, response);
  },

  getByUser: (userId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  getByAgent: (agentId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM conversations WHERE agent_id = ? ORDER BY created_at DESC');
    return stmt.all(agentId);
  }
};

// Contact message operations
export const contactMessageOperations = {
  create: (name: string, email: string, company: string, message: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO contact_messages (name, email, company, message) VALUES (?, ?, ?, ?)');
    return stmt.run(name, email, company, message);
  },

  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return stmt.all();
  },

  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM contact_messages WHERE id = ?');
    return stmt.get(id);
  },

  updateStatus: (id: number, status: string) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?');
    return stmt.run(status, id);
  },

  delete: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
    return stmt.run(id);
  }
};

// Subscription operations
export const subscriptionOperations = {
  create: (email: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO subscriptions (email) VALUES (?)');
    return stmt.run(email);
  },

  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM subscriptions ORDER BY created_at DESC');
    return stmt.all();
  },

  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE id = ?');
    return stmt.get(id);
  },

  updateStatus: (id: number, status: string) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE subscriptions SET status = ? WHERE id = ?');
    return stmt.run(status, id);
  },

  delete: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM subscriptions WHERE id = ?');
    return stmt.run(id);
  },

  getByEmail: (email: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE email = ?');
    return stmt.get(email);
  }
};

// Agent video operations
export const agentVideoOperations = {
  create: (agentId: number, title: string, description: string, videoUrl: string, thumbnailUrl?: string) => {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO agent_videos (agent_id, title, description, video_url, thumbnail_url) VALUES (?, ?, ?, ?, ?)');
    return stmt.run(agentId, title, description, videoUrl, thumbnailUrl);
  },

  getByAgentId: (agentId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM agent_videos WHERE agent_id = ? ORDER BY created_at DESC');
    return stmt.all(agentId);
  },

  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM agent_videos WHERE id = ?');
    return stmt.get(id);
  },

  update: (id: number, data: { title?: string; description?: string; videoUrl?: string; thumbnailUrl?: string }) => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE agent_videos SET title = ?, description = ?, video_url = ?, thumbnail_url = ? WHERE id = ?');
    return stmt.run(data.title, data.description, data.videoUrl, data.thumbnailUrl, id);
  },

  delete: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM agent_videos WHERE id = ?');
    return stmt.run(id);
  },

  deleteByAgentId: (agentId: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM agent_videos WHERE agent_id = ?');
    return stmt.run(agentId);
  }
};

// Site settings operations
export const siteSettingsOperations = {
  get: (key: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM site_settings WHERE key = ?');
    return stmt.get(key);
  },

  set: (key: string, value: string, description?: string) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO site_settings (key, value, description, updated_at) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(key, value, description);
  },

  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM site_settings ORDER BY key');
    return stmt.all();
  },

  delete: (key: string) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM site_settings WHERE key = ?');
    return stmt.run(key);
  }
}; 