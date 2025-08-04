import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    console.log('Fixing database schema...');
    
    const db = getDatabase();
    
    // First, let's check what tables exist
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Existing tables:', tables);
    
    // Check if users table exists and its current schema
    const usersTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (usersTable) {
      const usersSchema = db.prepare("PRAGMA table_info(users)").all();
      console.log('Current users table schema:', usersSchema);
      
      const existingColumns = usersSchema.map((col: any) => col.name);
      console.log('Existing columns:', existingColumns);
      
      // Add missing columns one by one
      const requiredColumns = [
        { name: 'password', sql: 'ALTER TABLE users ADD COLUMN password TEXT' },
        { name: 'company', sql: 'ALTER TABLE users ADD COLUMN company TEXT' },
        { name: 'provider', sql: 'ALTER TABLE users ADD COLUMN provider TEXT DEFAULT "email"' },
        { name: 'provider_id', sql: 'ALTER TABLE users ADD COLUMN provider_id TEXT' },
        { name: 'avatar_url', sql: 'ALTER TABLE users ADD COLUMN avatar_url TEXT' },
        { name: 'is_verified', sql: 'ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0' },
        { name: 'last_login', sql: 'ALTER TABLE users ADD COLUMN last_login DATETIME' },
        { name: 'created_at', sql: 'ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP' },
        { name: 'updated_at', sql: 'ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP' }
      ];
      
      for (const column of requiredColumns) {
        if (!existingColumns.includes(column.name)) {
          console.log(`Adding missing column: ${column.name}`);
          try {
            db.exec(column.sql);
            console.log(`Column ${column.name} added successfully`);
          } catch (error) {
            console.log(`Column ${column.name} already exists or error:`, error);
          }
        } else {
          console.log(`Column ${column.name} already exists`);
        }
      }
    } else {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
      db.exec(`
        CREATE TABLE users (
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
      `);
      console.log('Users table created successfully');
    }
    
    // Get final schema
    const finalSchema = db.prepare("PRAGMA table_info(users)").all();
    console.log('Final users table schema:', finalSchema);
    
    // Test inserting a user
    console.log('Testing user insertion...');
    const testResult = db.prepare('INSERT INTO users (email, name, password, company, provider) VALUES (?, ?, ?, ?, ?)').run('test@test.com', 'Test User', 'testpass', 'Test Company', 'email');
    
    console.log('Test insert result:', testResult);
    
    // Get the test user
    const testUser = db.prepare('SELECT * FROM users WHERE email = ?').get('test@test.com');
    console.log('Test user retrieved:', testUser);
    
    // Delete the test user
    db.prepare('DELETE FROM users WHERE email = ?').run('test@test.com');
    console.log('Test user deleted');
    
    // Get final user count
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    return NextResponse.json({
      success: true,
      message: 'Database schema fixed successfully',
      testInsertWorked: !!testResult.lastInsertRowid,
      testUserRetrieved: !!testUser,
      finalUserCount: (userCount as any).count,
      existingTables: tables.map((t: any) => t.name),
      finalColumns: finalSchema.map((col: any) => col.name)
    });
    
  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      error: 'Database fix failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 