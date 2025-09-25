#!/usr/bin/env node

/**
 * Generate stats.json from problems_metadata.json
 *
 * Creates aggregate statistics by topics and difficulty from the extracted problems metadata.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ProblemData {
  title?: string;
  difficulty?: string;
  topics?: string[];
  solutions: Record<string, any>;
}

interface ProblemsMetadata {
  [problemId: string]: ProblemData;
}

interface Stats {
  topics: Record<string, string[]>;
  difficulty: Record<string, string[]>;
  time_complexity: Record<string, string[]>;
}

async function generateStats() {
  try {
    // Read the problems metadata
    const metadataPath = resolve(__dirname, '../lib/extracted-metadata/problems_metadata.json');
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const problemsMetadata: ProblemsMetadata = JSON.parse(metadataContent).problems;

    // Initialize stats structure
    const stats: Stats = {
      topics: {},
      difficulty: {},
      time_complexity: {}
    };

    // Process each problem
    for (const [problemId, problemData] of Object.entries(problemsMetadata)) {
      // Group by topics
      if (problemData.topics && Array.isArray(problemData.topics)) {
        for (const topic of problemData.topics) {
          if (!stats.topics[topic]) {
            stats.topics[topic] = [];
          }
          stats.topics[topic].push(problemId);
        }
      }

      // Group by difficulty
      if (problemData.difficulty) {
        const difficulty = problemData.difficulty.toLowerCase();
        if (!stats.difficulty[difficulty]) {
          stats.difficulty[difficulty] = [];
        }
        stats.difficulty[difficulty].push(problemId);
      }

      // Group by time complexity (problem -> complexities array)
      if (problemData.solutions) {
        const timeComplexities: string[] = [];
        for (const solution of Object.values(problemData.solutions)) {
          if (solution.time_complexity) {
            // Extract only the first line (before first newline)
            let firstLine = solution.time_complexity.split('\n')[0].trim();
            if (firstLine) {
              // Remove colons and trailing text after colon
              if (firstLine.includes(':')) {
                firstLine = firstLine.split(':')[0].trim();
              }

              // Convert to KaTeX format if not already
              if (!firstLine.startsWith('$') || !firstLine.endsWith('$')) {
                // Clean up common patterns and convert to KaTeX
                firstLine = firstLine
                  .replace(/worst case /i, '')
                  .replace(/best case /i, '')
                  .replace(/average case /i, '')
                  .replace(/^O\(/g, 'O(')
                  .replace(/\*/g, ' \\cdot ')
                  .replace(/log/g, '\\log')
                  .trim();

                firstLine = `$${firstLine}$`;
              }

              timeComplexities.push(firstLine);
            }
          }
        }

        if (timeComplexities.length > 0) {
          stats.time_complexity[problemId] = timeComplexities;
        }
      }
    }

    // Sort arrays for consistent output
    for (const topic in stats.topics) {
      stats.topics[topic].sort();
    }
    for (const difficulty in stats.difficulty) {
      stats.difficulty[difficulty].sort();
    }
    // time_complexity is already organized by problemId, no need to sort the keys

    // Ensure output directory exists
    const outputDir = resolve(__dirname, '../lib/extracted-metadata');
    await mkdir(outputDir, { recursive: true });

    // Write stats.json
    const outputPath = resolve(outputDir, 'stats.json');
    await writeFile(outputPath, JSON.stringify(stats, null, 2), 'utf-8');

    // Log summary
    const topicCount = Object.keys(stats.topics).length;
    const difficultyCount = Object.keys(stats.difficulty).length;
    const complexityCount = Object.keys(stats.time_complexity).length;
    const totalProblems = Object.keys(problemsMetadata).length;

    console.log(`✅ Generated stats.json with:`);
    console.log(`   📊 ${totalProblems} total problems`);
    console.log(`   🏷️  ${topicCount} topics: ${Object.keys(stats.topics).sort().join(', ')}`);
    console.log(`   📈 ${difficultyCount} difficulties: ${Object.keys(stats.difficulty).sort().join(', ')}`);
    console.log(`   ⏱️  ${complexityCount} problems with time complexities`);
    console.log(`   📁 Output: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error generating stats:', error);
    process.exit(1);
  }
}

generateStats();