import { NextRequest, NextResponse } from 'next/server';
import { agentOperations } from '@/lib/database';

export async function GET() {
  try {
    const agents = await agentOperations.getAll();
    // Ensure we always return an array
    if (Array.isArray(agents)) {
      return NextResponse.json(agents);
    } else {
      console.error('Agents data is not an array:', agents);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Agents API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, description, config, photoUrl, keyValue, features } = await request.json();

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // For now, use a default user ID (1) - in a real app, this would come from authentication
    const userId = 1;
    
    const result = await agentOperations.create(userId, name, type, description, config, photoUrl, keyValue, features);

    const newAgent = {
      id: result.id,
      name,
      type,
      description,
      config,
      photo_url: photoUrl,
      key_value: keyValue,
      features,
      user_id: userId,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error('Agents API error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
