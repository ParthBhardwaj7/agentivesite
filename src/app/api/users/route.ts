import { NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';

export async function GET() {
  try {
    const users = userOperations.getAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, name, company } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const result = userOperations.create(email, name, company);
    return NextResponse.json({ 
      message: 'User created successfully',
      userId: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 