import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real application, you might want to invalidate tokens here
    // For now, we'll just return success since the client will handle clearing the session
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 