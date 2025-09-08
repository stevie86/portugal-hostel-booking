export interface DatabaseStatus {
  isConnected: boolean;
  isMigrated: boolean;
  hasData: boolean;
  tables: string[];
  error?: string;
}

// Client-side placeholder - actual implementation moved to API routes
export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  // This will be called from the client, but implemented server-side
  const response = await fetch('/api/admin/database-status');
  if (!response.ok) {
    throw new Error('Failed to check database status');
  }
  return response.json();
}

export async function runMigrations(): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('/api/admin/run-migrations', { method: 'POST' });
  return response.json();
}

export async function seedDatabase(): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('/api/admin/seed-database', { method: 'POST' });
  return response.json();
}

export async function generatePrismaClient(): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('/api/admin/generate-client', { method: 'POST' });
  return response.json();
}