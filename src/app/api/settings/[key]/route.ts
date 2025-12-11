import { NextRequest, NextResponse } from 'next/server';
import { siteSettingsOperations } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await siteSettingsOperations.get(params.key);
    
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
} 