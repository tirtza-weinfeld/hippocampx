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

async function resetDatabase() {
  console.log('🗑️  Dropping all problem-related tables...\n');

  // Drop tables in order (cascade will handle dependencies)
  await db.execute(sql`DROP TABLE IF EXISTS symbols CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS solutions CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS problems CASCADE`);
  await db.execute(sql`DROP TYPE IF EXISTS difficulty CASCADE`);

  console.log('✅ All tables dropped\n');
  console.log('📝 Now run: pnpm db:push\n');

  process.exit(0);
}

resetDatabase().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
