import { NextRequest, NextResponse } from 'next/server';
import { agentVideoOperations } from '@/lib/database';

export async function GET() {
  try {
    // Get all videos from all agents
    const db = require('@/lib/database').getDatabase();
    const stmt = db.prepare(`
      SELECT v.*, a.name as agent_name 
      FROM agent_videos v 
      JOIN ai_agents a ON v.agent_id = a.id 
      ORDER BY v.created_at DESC
    `);
    const videos = stmt.all();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agent_id, title, description, video_url, thumbnail_url } = await request.json();

    if (!agent_id || !title || !video_url) {
      return NextResponse.json(
        { error: 'Agent ID, title, and video URL are required' },
        { status: 400 }
      );
    }

    const result = agentVideoOperations.create(agent_id, title, description || '', video_url, thumbnail_url);

    return NextResponse.json({
      success: true,
      message: 'Video added successfully',
      id: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
} 