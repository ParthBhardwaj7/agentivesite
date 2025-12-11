import { NextRequest, NextResponse } from 'next/server';
import { contactMessageOperations } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await contactMessageOperations.create(name, email, company || '', message);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact message sent successfully',
        id: result.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send contact message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await contactMessageOperations.getAll();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
} 