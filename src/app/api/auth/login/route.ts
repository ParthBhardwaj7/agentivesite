import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userOperations.getByEmail(email) as any;

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User data:', user ? { id: user.id, email: user.email, hasPassword: !!user.password } : null);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has password (not social login)
    if (!user.password) {
      console.log('User has no password field');
      return NextResponse.json(
        { error: 'This account was created with social login. Please use the same method to sign in.' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Comparing password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await userOperations.updateLastLogin(user.id);

    // Return user data (without password)
    const { password: userPassword, ...userData } = user;
    
    console.log('Login successful for user:', userData.email);
    
    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Login API error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
