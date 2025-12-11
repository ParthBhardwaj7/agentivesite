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
    const db = await getDatabase();

    // Check all tables
    const tables = await new Promise<any[]>((resolve, reject) => {
      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Check users table specifically
    const usersTable = await new Promise<{ name: string } | undefined>((resolve, reject) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) reject(err);
        else resolve(row as { name: string } | undefined);
      });
    });

    const usersSchema = usersTable ? await new Promise<any[]>((resolve, reject) => {
      db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }) : null;

    const userCount = usersTable ? await new Promise<{ count: number }>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) reject(err);
        else resolve(row as { count: number });
      });
    }) : null;
    
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