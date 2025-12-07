import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import { sql } from 'drizzle-orm';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '..', '.env.local') });

const db = drizzle(vercelSql);

async function checkSchema() {
  console.log('🔍 Checking current database schema...\n');

  // List all tables
  const tables = await db.execute(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log('📊 Current tables:');
  for (const row of tables.rows) {
    const { table_name } = row as { table_name: string };
    console.log(`  - ${table_name}`);
  }

  // Check if symbols table exists
  const symbolsExists = tables.rows.some((row) => {
    const { table_name } = row as { table_name: string };
    return table_name === 'symbols';
  });

  console.log(`\n✓ Symbols table exists: ${symbolsExists}`);

  // Check solutions table columns
  const solutionColumns = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'solutions'
    ORDER BY ordinal_position
  `);

  console.log('\n📋 Solutions table columns:');
  for (const row of solutionColumns.rows) {
    const { column_name, data_type } = row as { column_name: string; data_type: string };
    console.log(`  - ${column_name}: ${data_type}`);
  }

  process.exit(0);
}

checkSchema().catch((error: unknown) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
