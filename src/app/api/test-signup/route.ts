import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, userOperations } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company } = await request.json();
    
    console.log('Test signup received:', { name, email, company, passwordLength: password?.length });
    
    // Check if database is accessible
    const db = getDatabase();
    console.log('Database connected successfully');
    
    // Check if users table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();
    
    console.log('Users table exists:', !!tableExists);
    
    if (!tableExists) {
      return NextResponse.json({
        error: 'Users table does not exist',
        tables: db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
      }, { status: 500 });
    }
    
    // Check table schema
    const schema = db.prepare("PRAGMA table_info(users)").all();
    console.log('Users table schema:', schema);
    
    // Check if user already exists
    const existingUser = userOperations.getByEmail(email);
    console.log('Existing user check:', existingUser ? 'User exists' : 'No existing user');
    
    if (existingUser) {
      return NextResponse.json({
        error: 'User with this email already exists'
      }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');
    
    // Try to create user
    console.log('Attempting to create user...');
    const result = userOperations.create(email, name, hashedPassword, company);
    console.log('User creation result:', result);
    
    if (!result.lastInsertRowid) {
      return NextResponse.json({
        error: 'Failed to create user - no ID returned',
        result
      }, { status: 500 });
    }
    
    // Get the created user
    const newUser = userOperations.getById(result.lastInsertRowid as number);
    console.log('Retrieved new user:', newUser);
    
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
      message: 'Test signup successful'
    });
    
  } catch (error) {
    console.error('Test signup error:', error);
    return NextResponse.json({
      error: 'Test signup failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 