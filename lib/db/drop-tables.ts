import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '..', '..', '.env.local') });

const db = drizzle(vercelSql);

async function dropTables() {
  console.log('🗑️  Dropping non-problem related tables...\n');

  const sqlFile = path.join(__dirname, 'drop-non-problem-tables.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await db.execute(sql.raw(statement));
      console.log(`✅ Executed: ${statement.substring(0, 60)}...`);
    } catch (error: any) {
      console.error(`❌ Error executing: ${statement.substring(0, 60)}...`);
      console.error(error?.message || error);
    }
  }

  console.log('\n✨ Done!');
  process.exit(0);
}

dropTables().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
