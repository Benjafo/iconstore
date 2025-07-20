#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database migration runner
 * Executes SQL migration files in order
 */
class MigrationRunner {
  constructor(databaseUrl) {
    this.client = new pg.Client({ connectionString: databaseUrl });
    this.migrationsDir = path.join(__dirname, '../migrations');
  }

  /**
   * Connect to database and ensure migrations table exists
   */
  async initialize() {
    await this.client.connect();
    
    // Create migrations tracking table
    await this.client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  /**
   * Get list of applied migrations
   */
  async getAppliedMigrations() {
    const result = await this.client.query(
      'SELECT version FROM schema_migrations ORDER BY version'
    );
    return result.rows.map(row => row.version);
  }

  /**
   * Get list of available migration files
   */
  async getAvailableMigrations() {
    try {
      const files = await fs.readdir(this.migrationsDir);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort();
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Migrations directory not found: ${this.migrationsDir}`);
      }
      throw error;
    }
  }

  /**
   * Execute a single migration file
   */
  async executeMigration(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const sql = await fs.readFile(filePath, 'utf8');
    
    // Execute within transaction
    await this.client.query('BEGIN');
    try {
      await this.client.query(sql);
      
      // Record migration as applied
      const version = filename.replace('.sql', '');
      await this.client.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        [version]
      );
      
      await this.client.query('COMMIT');
      console.log(`✅ Applied migration: ${filename}`);
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw new Error(`Failed to apply migration ${filename}: ${error.message}`);
    }
  }

  /**
   * Run all pending migrations
   */
  async migrate() {
    const applied = await this.getAppliedMigrations();
    const available = await this.getAvailableMigrations();
    
    const pending = available.filter(file => {
      const version = file.replace('.sql', '');
      return !applied.includes(version);
    });

    if (pending.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`📋 Running ${pending.length} migration(s):`);
    
    for (const migration of pending) {
      await this.executeMigration(migration);
    }
    
    console.log('🎉 All migrations completed successfully');
  }

  /**
   * Close database connection
   */
  async close() {
    await this.client.end();
  }
}

/**
 * Main execution function
 */
async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const runner = new MigrationRunner(databaseUrl);
  
  try {
    await runner.initialize();
    await runner.migrate();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { MigrationRunner };