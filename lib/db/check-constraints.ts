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

async function checkConstraints() {
  console.log('🔍 Checking constraints on solutions table...\n');

  const constraints = await db.execute(sql`
    SELECT conname, contype, pg_get_constraintdef(oid) as definition
    FROM pg_constraint
    WHERE conrelid = 'solutions'::regclass
  `);

  console.log('📋 Constraints:');
  constraints.rows.forEach((row: any) => {
    console.log(`  - ${row.conname} (${row.contype}): ${row.definition}`);
  });

  process.exit(0);
}

checkConstraints().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
