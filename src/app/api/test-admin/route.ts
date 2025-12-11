import { NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await userOperations.getByEmail('admin@agentive.ai') as any;
    
    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        message: 'Admin user not found. Please run /api/setup-default-user'
      });
    }

    // Test password verification
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, adminUser.password);

    return NextResponse.json({
      exists: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length || 0
      },
      passwordTest: {
        testPassword: testPassword,
        isValid: isValid
      }
    });

  } catch (error) {
    console.error('Test admin error:', error);
    return NextResponse.json({
      error: 'Failed to test admin user',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
