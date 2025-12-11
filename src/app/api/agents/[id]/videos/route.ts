import { NextRequest, NextResponse } from 'next/server';
import { agentVideoOperations } from '@/lib/database';

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

    const videos = await agentVideoOperations.getByAgentId(agentId);
    return NextResponse.json(videos);

  } catch (error) {
    console.error('Error fetching agent videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent videos' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { title, description, videoUrl, thumbnailUrl } = await request.json();

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      );
    }

    const result = await agentVideoOperations.create(agentId, title, description || '', videoUrl, thumbnailUrl);

    return NextResponse.json({
      success: true,
      message: 'Video added successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Error creating agent video:', error);
    return NextResponse.json(
      { error: 'Failed to create agent video' },
      { status: 500 }
    );
  }
} 