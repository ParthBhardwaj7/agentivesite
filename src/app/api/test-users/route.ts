import { NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';

export async function GET() {
  try {
    console.log('Testing userOperations...');
    
    // Test getAll
    console.log('Testing getAll...');
    const allUsers = userOperations.getAll();
    console.log('All users result:', allUsers);
    
    // Test getByEmail with a test email
    console.log('Testing getByEmail...');
    const testUser = userOperations.getByEmail('test@example.com');
    console.log('Test user lookup result:', testUser);
    
    return NextResponse.json({
      success: true,
      message: 'UserOperations test successful',
      allUsersCount: allUsers.length,
      testUserFound: !!testUser
    });
    
  } catch (error) {
    console.error('UserOperations test error:', error);
    return NextResponse.json({
      error: 'UserOperations test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 