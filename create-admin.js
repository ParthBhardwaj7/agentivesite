const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'nexusagents.db');

// Create admin user
async function createAdminUser() {
  const db = new sqlite3.Database(dbPath);

  try {
    // Check if admin user exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', ['admin@agentive.ai'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.log('✅ Admin user already exists:', existingUser.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, name, password, company, provider, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin@agentive.ai', 'Admin User', hashedPassword, 'Agentive AI', 'email', 1],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@agentive.ai');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    db.close();
  }
}

createAdminUser();
