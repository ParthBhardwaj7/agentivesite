import { NextRequest, NextResponse } from 'next/server';
import { contactMessageOperations } from '@/lib/database';

export async function GET() {
  try {
    const messages = await contactMessageOperations.getAll();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Contact messages API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    await contactMessageOperations.updateStatus(id, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact messages API error:', error);
    return NextResponse.json(
      { error: 'Failed to update message status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await contactMessageOperations.delete(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact messages API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 