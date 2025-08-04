import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company } = await request.json();
    
    console.log('Test signup without bcrypt received:', { name, email, company, passwordLength: password?.length });
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = userOperations.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user without hashing password (for testing)
    console.log('Attempting to create user without bcrypt...');
    const result = userOperations.create(email, name, password, company);
    
    console.log('Signup result without bcrypt:', result);
    
    if (!result.lastInsertRowid) {
      throw new Error('Failed to create user - no ID returned');
    }

    // Get the created user
    const newUser = userOperations.getById(result.lastInsertRowid as number);
    
    if (!newUser) {
      throw new Error('Failed to retrieve created user');
    }

    // Return user data (without password)
    const { password: _, ...userData } = newUser as any;
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Account created successfully (without bcrypt)'
    }, { status: 201 });

  } catch (error) {
    console.error('Test signup without bcrypt error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 