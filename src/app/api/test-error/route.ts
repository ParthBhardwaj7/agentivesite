import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test error endpoint called');
    
    // Try to parse JSON
    const body = await request.json();
    console.log('Request body:', body);
    
    // Try to access userOperations
    console.log('Importing userOperations...');
    const { userOperations } = await import('@/lib/database');
    console.log('userOperations imported successfully');
    
    // Try to get database
    console.log('Getting database...');
    const { getDatabase } = await import('@/lib/database');
    const db = getDatabase();
    console.log('Database obtained successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Test error endpoint worked',
      body
    });
    
  } catch (error) {
    console.error('Test error endpoint failed:', error);
    return NextResponse.json({
      error: 'Test error endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 