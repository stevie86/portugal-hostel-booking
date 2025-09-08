import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    execSync('npx prisma db seed', {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Seeding failed'
    }, { status: 500 });
  }
}