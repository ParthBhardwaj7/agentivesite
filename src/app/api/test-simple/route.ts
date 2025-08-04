import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company } = await request.json();
    
    console.log('Simple test received:', { name, email, company, passwordLength: password?.length });
    
    // Get database
    const db = getDatabase();
    
    // Check if users table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();
    
    if (!tableExists) {
      return NextResponse.json({
        error: 'Users table does not exist'
      }, { status: 500 });
    }
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return NextResponse.json({
        error: 'User with this email already exists'
      }, { status: 400 });
    }
    
    // Try to create user without hashing password
    console.log('Attempting to create user...');
    const result = db.prepare('INSERT INTO users (email, name, password, company, provider) VALUES (?, ?, ?, ?, ?)').run(email, name, password, company, 'email');
    
    console.log('User creation result:', result);
    
    if (!result.lastInsertRowid) {
      return NextResponse.json({
        error: 'Failed to create user - no ID returned',
        result
      }, { status: 500 });
    }
    
    // Get the created user
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    
    if (!newUser) {
      return NextResponse.json({
        error: 'Failed to retrieve created user'
      }, { status: 500 });
    }
    
    // Return success
    const { password: _, ...userData } = newUser as any;
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Simple test successful'
    });
    
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json({
      error: 'Simple test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 