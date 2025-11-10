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
  tables.rows.forEach((row: any) => {
    console.log(`  - ${row.table_name}`);
  });

  // Check if symbols table exists
  const symbolsExists = tables.rows.some((row: any) => row.table_name === 'symbols');

  console.log(`\n✓ Symbols table exists: ${symbolsExists}`);

  // Check solutions table columns
  const solutionColumns = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'solutions'
    ORDER BY ordinal_position
  `);

  console.log('\n📋 Solutions table columns:');
  solutionColumns.rows.forEach((row: any) => {
    console.log(`  - ${row.column_name}: ${row.data_type}`);
  });

  process.exit(0);
}

checkSchema().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
