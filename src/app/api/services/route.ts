import { NextResponse } from 'next/server';
import { serviceOperations } from '@/lib/database';

export async function GET() {
  try {
    const services = await serviceOperations.getAll();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 