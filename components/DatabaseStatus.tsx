'use client';

import React, { useState, useEffect } from 'react';
import { checkDatabaseStatus, runMigrations } from '../lib/db-check';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isMigrated: boolean;
    hasData: boolean;
    tables: string[];
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const dbStatus = await checkDatabaseStatus();
      setStatus(dbStatus);
    } catch (error) {
      setStatus({
        isConnected: false,
        isMigrated: false,
        hasData: false,
        tables: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleRunMigrations = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await runMigrations();
      if (result.success) {
        setMessage('✅ Database migrations completed successfully!');
        await checkStatus(); // Refresh status
      } else {
        setMessage(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) {
    return (
      <div className="p-4 bg-gray-50 border rounded-lg">
        <div className="animate-pulse">Checking database status...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Database Status</h3>

      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Database Connection: {status.isConnected ? '✅ Connected' : '❌ Disconnected'}</span>
        </div>

        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status.isMigrated ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Database Schema: {status.isMigrated ? '✅ Migrated' : '❌ Not Migrated'}</span>
        </div>

        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status.hasData ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span>Sample Data: {status.hasData ? '✅ Present' : '⚠️ Not Seeded'}</span>
        </div>
      </div>

      {status.tables.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">Tables: {status.tables.join(', ')}</p>
        </div>
      )}

      {status.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          Error: {status.error}
        </div>
      )}

      {!status.isMigrated && (
        <div className="mt-4">
          <button
            onClick={handleRunMigrations}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running Migrations...' : 'Run Database Migrations'}
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        💡 Need help? Run <code className="bg-gray-100 px-1 rounded">./scripts/setup.sh</code> for complete setup
      </div>
    </div>
  );
}