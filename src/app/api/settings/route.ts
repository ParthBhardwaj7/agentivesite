import { NextRequest, NextResponse } from 'next/server';
import { siteSettingsOperations } from '@/lib/database';

export async function GET() {
  try {
    const settings = await siteSettingsOperations.getAll();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, description } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const result = await siteSettingsOperations.set(key, value, description);
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
} 