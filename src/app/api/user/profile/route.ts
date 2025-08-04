import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const user = userOperations.getById(parseInt(userId));
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password: _, ...userData } = user as any;
    
    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    const { name, company } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Update user profile
    const result = userOperations.updateProfile(parseInt(userId), { name, company });
    
    if (!result.changes) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user
    const updatedUser = userOperations.getById(parseInt(userId));
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to get updated user' },
        { status: 500 }
      );
    }

    // Return updated user data without password
    const { password: _, ...userData } = updatedUser as any;
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 