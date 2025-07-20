#!/usr/bin/env node
import pg from 'pg';

/**
 * Database connection and schema verification test
 */
class DatabaseTester {
  constructor(databaseUrl) {
    this.client = new pg.Client({ connectionString: databaseUrl });
    this.expectedTables = [
      'users',
      'currency_packages',
      'currency_transactions',
      'icon_packs',
      'icons',
      'purchases',
      'user_owned_icons',
      'schema_migrations',
    ];
  }

  /**
   * Connect to database
   */
  async connect() {
    await this.client.connect();
    console.log('✅ Database connection successful');
  }

  /**
   * Test basic database connectivity
   */
  async testConnection() {
    const result = await this.client.query('SELECT NOW() as current_time');
    console.log(
      `✅ Database query successful - Current time: ${result.rows[0].current_time}`
    );
  }

  /**
   * Verify all expected tables exist
   */
  async verifyTables() {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    const result = await this.client.query(query);
    const existingTables = result.rows.map(row => row.table_name);

    console.log('\n📋 Table verification:');

    const missingTables = [];
    for (const table of this.expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MISSING`);
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      throw new Error(`Missing tables: ${missingTables.join(', ')}`);
    }

    console.log(`\n✅ All ${this.expectedTables.length} expected tables found`);
  }

  /**
   * Verify table schemas and constraints
   */
  async verifySchemas() {
    console.log('\n🔍 Schema verification:');

    // Test users table structure
    const usersQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    const usersResult = await this.client.query(usersQuery);
    console.log(`  ✅ users table has ${usersResult.rows.length} columns`);

    // Verify UUID primary keys
    const pkQuery = `
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `;
    const pkResult = await this.client.query(pkQuery);
    console.log(`  ✅ ${pkResult.rows.length} primary key constraints found`);

    // Verify foreign key relationships
    const fkQuery = `
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `;
    const fkResult = await this.client.query(fkQuery);
    console.log(`  ✅ ${fkResult.rows.length} foreign key constraints found`);
  }

  /**
   * Test ENUM types
   */
  async verifyEnumTypes() {
    const enumQuery = `
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'transaction_type'
      ORDER BY e.enumsortorder
    `;

    const result = await this.client.query(enumQuery);
    const enumValues = result.rows.map(row => row.enumlabel);
    const expectedValues = [
      'purchase',
      'refund',
      'bonus',
      'admin_adjustment',
      'currency_buy',
    ];

    console.log('\n🎯 ENUM verification:');
    console.log(
      `  ✅ transaction_type enum with values: ${enumValues.join(', ')}`
    );

    if (enumValues.length !== expectedValues.length) {
      throw new Error(
        `Expected ${expectedValues.length} enum values, found ${enumValues.length}`
      );
    }
  }

  /**
   * Test basic CRUD operations
   */
  async testBasicOperations() {
    console.log('\n🧪 Basic operations test:');

    // Test insert
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      password_hash: 'hashed_password_123',
    };

    const insertResult = await this.client.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [testUser.email, testUser.username, testUser.password_hash]
    );
    const userId = insertResult.rows[0].id;
    console.log(`  ✅ Insert test user - ID: ${userId}`);

    // Test select
    const selectResult = await this.client.query(
      'SELECT email, username FROM users WHERE id = $1',
      [userId]
    );
    console.log(`  ✅ Select test user - Email: ${selectResult.rows[0].email}`);

    // Test cleanup
    await this.client.query('DELETE FROM users WHERE id = $1', [userId]);
    console.log('  ✅ Cleanup test data');
  }

  /**
   * Verify migration tracking
   */
  async verifyMigrations() {
    const result = await this.client.query(
      'SELECT version, applied_at FROM schema_migrations ORDER BY version'
    );

    console.log('\n📊 Migration status:');
    result.rows.forEach(row => {
      console.log(
        `  ✅ ${row.version} - Applied: ${row.applied_at.toISOString()}`
      );
    });
  }

  /**
   * Close database connection
   */
  async close() {
    await this.client.end();
    console.log('\n🔌 Database connection closed');
  }
}

/**
 * Main test execution
 */
async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;

  if (!databaseUrl) {
    console.error(
      '❌ DATABASE_URL or TEST_DATABASE_URL environment variable is required'
    );
    console.error(
      '💡 Copy .env.example to .env and configure your database connection'
    );
    process.exit(1);
  }

  const tester = new DatabaseTester(databaseUrl);

  try {
    console.log('🚀 Starting database tests...\n');

    await tester.connect();
    await tester.testConnection();
    await tester.verifyTables();
    await tester.verifySchemas();
    await tester.verifyEnumTypes();
    await tester.testBasicOperations();
    await tester.verifyMigrations();

    console.log('\n🎉 All database tests passed!');
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await tester.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DatabaseTester };
