import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DatabaseStatus {
  isConnected: boolean;
  isMigrated: boolean;
  hasData: boolean;
  tables: string[];
  error?: string;
}

export async function GET() {
  const status: DatabaseStatus = {
    isConnected: false,
    isMigrated: false,
    hasData: false,
    tables: []
  };

  try {
    // Test connection
    await prisma.$connect();
    status.isConnected = true;

    // Check if tables exist (indicates migration has been run)
    const result = await prisma.$queryRaw`
      SELECT name FROM sqlite_master
      WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE '_prisma_%'
    ` as { name: string }[];

    status.tables = result.map(row => row.name);
    status.isMigrated = status.tables.length > 0;

    // Check if there's any data
    if (status.isMigrated) {
      for (const table of status.tables) {
        try {
          const count = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM ${table as any}
          ` as { count: number }[];

          if (count[0].count > 0) {
            status.hasData = true;
            break;
          }
        } catch (error) {
          // Skip tables that might have issues
          continue;
        }
      }
    }

  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown database error';
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(status);
}