import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'nexusagents.db');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialize database
export function initDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create tables
      const createTablesSQL = `
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
      `;

      db.exec(createTablesSQL, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Add missing columns to existing ai_agents table if they don't exist
        const alterQueries = [
          'ALTER TABLE ai_agents ADD COLUMN photo_url TEXT;',
          'ALTER TABLE ai_agents ADD COLUMN key_value TEXT;',
          'ALTER TABLE ai_agents ADD COLUMN features TEXT;'
        ];

        let completed = 0;
        alterQueries.forEach(query => {
          db.run(query, () => {
            // Ignore errors for existing columns
            completed++;
            if (completed === alterQueries.length) {
              // Insert default data
              insertDefaultData(db, resolve, reject);
            }
          });
        });
      });
    });
  });
}

function insertDefaultData(db: sqlite3.Database, resolve: (db: sqlite3.Database) => void, reject: (err: Error) => void) {
  // Insert default services
  db.get('SELECT COUNT(*) as count FROM services', (err, row: any) => {
    if (err) {
      reject(err);
      return;
    }

    if (row.count === 0) {
      const services = [
        ['Custom AI Agents', 'Tailored AI agents for automation, support, and business intelligence', '🤖', '#00BFFF'],
        ['Conversational Bots', 'Smart chatbots for customer engagement and lead generation', '💬', '#00FFB2'],
        ['Agent Integrations', 'Seamless integration of AI agents with your existing tools', '🔗', '#00BFFF']
      ];

      let inserted = 0;
      services.forEach(service => {
        db.run('INSERT INTO services (name, description, icon, color) VALUES (?, ?, ?, ?)', service, (err) => {
          if (err) {
            reject(err);
            return;
          }
          inserted++;
          if (inserted === services.length) {
            insertDefaultAgent(db, resolve, reject);
          }
        });
      });
    } else {
      insertDefaultAgent(db, resolve, reject);
    }
  });
}

function insertDefaultAgent(db: sqlite3.Database, resolve: (db: sqlite3.Database) => void, reject: (err: Error) => void) {
  // Insert default agents
  db.get('SELECT COUNT(*) as count FROM ai_agents', (err, row: { count: number }) => {
    if (err) {
      reject(err);
      return;
    }

    if (row.count === 0) {
      const defaultAgents = [
        {
          user_id: 1,
          name: 'Agent 1',
          type: 'marketing',
          description: 'Advanced marketing automation agent for lead generation and campaign management.',
          photo_url: '',
          key_value: 'Saves 150+ hours per month',
          features: 'Lead generation, Campaign automation, Analytics tracking, Social media management, Email marketing, ROI optimization',
          status: 'active'
        },
        {
          user_id: 1,
          name: 'Agent 2',
          type: 'sales',
          description: 'Intelligent sales assistant that qualifies leads and guides prospects through the sales funnel.',
          photo_url: '',
          key_value: 'Increases conversion rate by 40%',
          features: 'Lead qualification, Automated follow-ups, CRM integration, Sales forecasting, Customer insights, Deal tracking',
          status: 'active'
        }
      ];

      let agentsInserted = 0;
      defaultAgents.forEach(agent => {
        const agentData = [
          agent.user_id,
          agent.name,
          agent.type,
          agent.description,
          agent.photo_url,
          agent.key_value,
          agent.features,
          agent.status
        ];

        db.run('INSERT INTO ai_agents (user_id, name, type, description, photo_url, key_value, features, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', agentData, (err) => {
          if (err) {
            reject(err);
            return;
          }

          agentsInserted++;
          if (agentsInserted === defaultAgents.length) {
            resolve(db);
          }
        });
      });
    } else {
      resolve(db);
    }
  });
}

// Database instance
let db: sqlite3.Database | null = null;

export async function getDatabase(): Promise<sqlite3.Database> {
  if (!db) {
    db = await initDatabase();
  }
  return db;
}

// User operations
export const userOperations = {
  // Create user with email/password
  create: async (email: string, name: string, password?: string, company?: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        console.log('Creating user in database:', { email, name, company, hasPassword: !!password });
        db.run('INSERT INTO users (email, name, password, company, provider) VALUES (?, ?, ?, ?, ?)',
          [email, name, password, company, 'email'],
          function(err) {
            if (err) {
              console.error('Database user creation error:', err);
              reject(err);
            } else {
              console.log('User creation database result:', { id: this.lastID, changes: this.changes });
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  // Create user with social provider
  createWithProvider: async (email: string, name: string, provider: string, providerId: string, avatarUrl?: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO users (email, name, provider, provider_id, avatar_url, is_verified) VALUES (?, ?, ?, ?, ?, 1)',
          [email, name, provider, providerId, avatarUrl],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  // Get user by email
  getByEmail: async (email: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        console.log('Looking up user by email:', email);
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) {
            console.error('Database user lookup error:', err);
            reject(err);
          } else {
            console.log('User lookup result:', row ? 'User found' : 'No user found');
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  // Get user by provider ID
  getByProviderId: async (provider: string, providerId: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM users WHERE provider = ? AND provider_id = ?', [provider, providerId], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  // Update last login
  updateLastLogin: async (userId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  // Verify user
  verifyUser: async (userId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE users SET is_verified = 1 WHERE id = ?', [userId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  // Get all users
  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  // Get user by ID
  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        console.log('Looking up user by ID:', id);
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Database user ID lookup error:', err);
            reject(err);
          } else {
            console.log('User ID lookup result:', row ? 'User found' : 'No user found');
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  // Update user profile
  updateProfile: async (id: number, data: { name?: string; company?: string }) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE users SET name = ?, company = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [data.name, data.company, id], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
      }).catch(reject);
    });
  }
};

// AI Agent operations
export const agentOperations = {
  create: async (userId: number, name: string, type: string, description?: string, config?: string, photoUrl?: string, keyValue?: string, features?: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO ai_agents (user_id, name, type, description, config, photo_url, key_value, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [userId, name, type, description, config, photoUrl, keyValue, features],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  getByUser: async (userId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM ai_agents WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM ai_agents ORDER BY created_at DESC', (err, rows) => {
          if (err) {
            console.error('Error getting agents from database:', err);
            reject(err);
          } else {
            console.log('Database agents result:', rows);
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  update: async (id: number, data: { name?: string; type?: string; description?: string; config?: string; photoUrl?: string; keyValue?: string; features?: string; status?: string }) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE ai_agents SET name = ?, type = ?, description = ?, config = ?, photo_url = ?, key_value = ?, features = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [data.name, data.type, data.description, data.config, data.photoUrl, data.keyValue, data.features, data.status, id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  delete: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM ai_agents WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM ai_agents WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  }
};

// Service operations
export const serviceOperations = {
  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM services WHERE is_active = 1 ORDER BY id', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  }
};

// Conversation operations
export const conversationOperations = {
  create: async (userId: number, agentId: number, message: string, response: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO conversations (user_id, agent_id, message, response) VALUES (?, ?, ?, ?)',
          [userId, agentId, message, response],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  getByUser: async (userId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getByAgent: async (agentId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM conversations WHERE agent_id = ? ORDER BY created_at DESC', [agentId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  }
};

// Contact message operations
export const contactMessageOperations = {
  create: async (name: string, email: string, company: string, message: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO contact_messages (name, email, company, message) VALUES (?, ?, ?, ?)',
          [name, email, company, message],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM contact_messages WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  updateStatus: async (id: number, status: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  delete: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM contact_messages WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  }
};

// Subscription operations
export const subscriptionOperations = {
  create: async (email: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO subscriptions (email) VALUES (?)', [email], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM subscriptions ORDER BY created_at DESC', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM subscriptions WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  updateStatus: async (id: number, status: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE subscriptions SET status = ? WHERE id = ?', [status, id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  delete: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM subscriptions WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  getByEmail: async (email: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM subscriptions WHERE email = ?', [email], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  }
};

// Agent video operations
export const agentVideoOperations = {
  create: async (agentId: number, title: string, description: string, videoUrl: string, thumbnailUrl?: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT INTO agent_videos (agent_id, title, description, video_url, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
          [agentId, title, description, videoUrl, thumbnailUrl],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  getByAgentId: async (agentId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM agent_videos WHERE agent_id = ? ORDER BY created_at DESC', [agentId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM agent_videos WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  update: async (id: number, data: { title?: string; description?: string; videoUrl?: string; thumbnailUrl?: string }) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('UPDATE agent_videos SET title = ?, description = ?, video_url = ?, thumbnail_url = ? WHERE id = ?',
          [data.title, data.description, data.videoUrl, data.thumbnailUrl, id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  delete: async (id: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM agent_videos WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  },

  deleteByAgentId: async (agentId: number) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM agent_videos WHERE agent_id = ?', [agentId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  }
};

// Site settings operations
export const siteSettingsOperations = {
  get: async (key: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.get('SELECT * FROM site_settings WHERE key = ?', [key], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }).catch(reject);
    });
  },

  set: async (key: string, value: string, description?: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('INSERT OR REPLACE INTO site_settings (key, value, description, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          [key, value, description],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
      }).catch(reject);
    });
  },

  getAll: async () => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.all('SELECT * FROM site_settings ORDER BY key', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }).catch(reject);
    });
  },

  delete: async (key: string) => {
    return new Promise((resolve, reject) => {
      getDatabase().then(db => {
        db.run('DELETE FROM site_settings WHERE key = ?', [key], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      }).catch(reject);
    });
  }
}; 