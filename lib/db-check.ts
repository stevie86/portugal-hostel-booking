import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DatabaseStatus {
  isConnected: boolean;
  isMigrated: boolean;
  hasData: boolean;
  tables: string[];
  error?: string;
}

/**
 * Check database connection and migration status
 */
export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
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
        const count = await prisma.$queryRaw`
          SELECT COUNT(*) as count FROM ${table as any}
        ` as { count: number }[];

        if (count[0].count > 0) {
          status.hasData = true;
          break;
        }
      }
    }

  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown database error';
  } finally {
    await prisma.$disconnect();
  }

  return status;
}

/**
 * Run database migrations
 */
export async function runMigrations(): Promise<{ success: boolean; error?: string }> {
  try {
    // For SQLite, we use prisma db push instead of migrations
    const { execSync } = require('child_process');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed'
    };
  }
}

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<{ success: boolean; error?: string }> {
  try {
    const { execSync } = require('child_process');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Seeding failed'
    };
  }
}

/**
 * Generate Prisma client
 */
export async function generatePrismaClient(): Promise<{ success: boolean; error?: string }> {
  try {
    const { execSync } = require('child_process');
    execSync('npx prisma generate', { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Client generation failed'
    };
  }
}