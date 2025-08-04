import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Check if table exists
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ai_agents'").get();
    
    if (!tableCheck) {
      return NextResponse.json({ error: 'ai_agents table does not exist' });
    }
    
    // Get table schema
    const schema = db.prepare("PRAGMA table_info(ai_agents)").all();
    
    // Try to get agents
    const agents = db.prepare('SELECT * FROM ai_agents ORDER BY created_at DESC').all();
    
    return NextResponse.json({
      tableExists: !!tableCheck,
      schema,
      agents,
      agentsCount: agents.length,
      agentsType: typeof agents,
      isArray: Array.isArray(agents)
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
} 