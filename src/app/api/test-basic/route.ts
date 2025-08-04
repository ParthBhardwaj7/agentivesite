import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    console.log('Basic test starting...');
    
    // Try to get database
    const db = getDatabase();
    console.log('Database connection successful');
    
    // Test a simple query
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log('User count result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Basic test successful',
      userCount: (result as any).count
    });
    
  } catch (error) {
    console.error('Basic test error:', error);
    return NextResponse.json({
      error: 'Basic test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 