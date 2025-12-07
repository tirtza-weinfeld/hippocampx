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

async function checkData() {
  console.log('📊 Checking database data...\n');

  // Count rows in each table
  const problemCount = await db.execute(sql`SELECT COUNT(*) FROM problems`);
  const solutionCount = await db.execute(sql`SELECT COUNT(*) FROM solutions`);
  const symbolCount = await db.execute(sql`SELECT COUNT(*) FROM symbols`);

  const pCount = problemCount.rows[0] as { count: number };
  const sCount = solutionCount.rows[0] as { count: number };
  const symCount = symbolCount.rows[0] as { count: number };
  console.log(`Problems: ${pCount.count}`);
  console.log(`Solutions: ${sCount.count}`);
  console.log(`Symbols: ${symCount.count}\n`);

  // Show a sample problem with its solutions
  const sample = await db.execute(sql`
    SELECT
      p.slug,
      p.title,
      (SELECT COUNT(*) FROM solutions WHERE problem_id = p.id) as solution_count,
      (SELECT COUNT(*) FROM symbols WHERE solution_id IN (SELECT id FROM solutions WHERE problem_id = p.id)) as symbol_count
    FROM problems p
    WHERE p.slug = '1235-maximum-profit-in-job-scheduling'
    LIMIT 1
  `);

  if (sample.rows.length > 0) {
    const sampleRow = sample.rows[0] as { title: string; solution_count: number; symbol_count: number };
    console.log('📝 Sample: Problem 1235');
    console.log(`  Title: ${sampleRow.title}`);
    console.log(`  Solutions: ${sampleRow.solution_count}`);
    console.log(`  Symbols: ${sampleRow.symbol_count}\n`);
  }

  // Show sample symbols
  const symbols = await db.execute(sql`
    SELECT s.qname, s.kind, s.name
    FROM symbols s
    JOIN solutions sol ON s.solution_id = sol.id
    JOIN problems p ON sol.problem_id = p.id
    WHERE p.slug = '1235-maximum-profit-in-job-scheduling'
    LIMIT 10
  `);

  console.log('🔍 Sample symbols from Problem 1235:');
  for (const row of symbols.rows) {
    const { kind, qname } = row as { kind: string; qname: string };
    console.log(`  ${kind}: ${qname}`);
  }

  process.exit(0);
}

checkData().catch((error: unknown) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
