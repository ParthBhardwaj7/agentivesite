import { NextRequest, NextResponse } from 'next/server';
import { agentOperations } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = parseInt(params.id);
    
    if (isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const agent = await agentOperations.getById(agentId);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);

  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, type, description, config, photoUrl, keyValue, features, status } = await request.json();

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    await agentOperations.update(id, {
      name,
      type,
      description,
      config,
      photoUrl,
      keyValue,
      features,
      status
    });

    // Get the updated agent
    const updatedAgent = await agentOperations.getById(id);
    
    if (!updatedAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Update agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await agentOperations.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
} 