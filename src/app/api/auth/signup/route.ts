import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company } = await request.json();
    
    console.log('Signup request received:', { name, email, company, passwordLength: password?.length });
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: missing required fields');
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
    const existingUser = await userOperations.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    console.log('Attempting to create user with:', { email, name, company, hashedPasswordLength: hashedPassword?.length });
    const result = await userOperations.create(email, name, hashedPassword, company);

    console.log('Signup result:', result);

    if (!result.id) {
      console.error('No id returned from user creation');
      throw new Error('Failed to create user - no ID returned');
    }

    // Get the created user
    const newUser = await userOperations.getById(result.id);
    
    console.log('Retrieved user:', newUser);
    
    if (!newUser) {
      throw new Error('Failed to retrieve created user');
    }

    // Return user data (without password)
    const { password: userPassword, ...userData } = newUser;
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
