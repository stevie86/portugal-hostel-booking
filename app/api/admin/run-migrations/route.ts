import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    // For SQLite, we use prisma db push instead of migrations
    execSync('npx prisma db push --force-reset', {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed'
    }, { status: 500 });
  }
}