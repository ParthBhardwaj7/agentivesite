import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'nexusagents.db');
    
    // Check if database file exists
    const fileExists = fs.existsSync(dbPath);
    const fileStats = fileExists ? fs.statSync(dbPath) : null;
    
    // Try to get database
    const db = getDatabase();
    
    // Check all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    
    // Check users table specifically
    const usersTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    const usersSchema = usersTable ? db.prepare("PRAGMA table_info(users)").all() : null;
    const userCount = usersTable ? db.prepare("SELECT COUNT(*) as count FROM users").get() : null;
    
    return NextResponse.json({
      success: true,
      database: {
        path: dbPath,
        exists: fileExists,
        size: fileStats ? fileStats.size : null,
        created: fileStats ? fileStats.birthtime : null,
        modified: fileStats ? fileStats.mtime : null
      },
      tables: tables.map((t: any) => t.name),
      users: {
        tableExists: !!usersTable,
        schema: usersSchema,
        count: (userCount as any)?.count || 0
      }
    });
    
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      error: 'Database debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 