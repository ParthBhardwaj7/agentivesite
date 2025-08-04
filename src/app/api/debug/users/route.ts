import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Check if users table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();
    
    if (!tableExists) {
      return NextResponse.json({
        error: 'Users table does not exist',
        tables: db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
      });
    }
    
    // Get table schema
    const schema = db.prepare("PRAGMA table_info(users)").all();
    
    // Get user count
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
    
    // Get all users (without passwords)
    const users = db.prepare("SELECT id, email, name, company, is_verified, created_at, last_login FROM users").all();
    
    return NextResponse.json({
      success: true,
      tableExists: !!tableExists,
      schema,
      userCount,
      users
    });
    
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      error: 'Failed to debug users table',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 