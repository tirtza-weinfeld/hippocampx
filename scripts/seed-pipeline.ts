#!/usr/bin/env tsx
/**
 * Dictionary Seed Pipeline
 *
 * Runs the full seed → embed → discover pipeline with prompts between steps.
 *
 * Usage: pnpm db:pipeline
 */

import { spawn } from "child_process";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(`\n${question} (Y/n): `, (answer) => {
      resolve(answer.toLowerCase() !== "n");
    });
  });
}

function runCommand(command: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Running: ${command} ${args.join(" ")}`);
    console.log("=".repeat(60) + "\n");

    const proc = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      resolve(code ?? 0);
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log("\n🚀 Dictionary Seed Pipeline\n");

  // Step 1: Seed dictionary
  const seedCode = await runCommand("pnpm", ["db:seed:dictionary"]);
  if (seedCode !== 0) {
    console.error("\n❌ Seed failed. Aborting.");
    process.exit(1);
  }
  console.log("\n✅ Seeding complete!");

  // Step 2: Embed senses
  const continueEmbed = await prompt("Continue to embed senses?");
  if (!continueEmbed) {
    console.log("\n👋 Stopped after seeding.");
    rl.close();
    return;
  }

  const embedCode = await runCommand("pnpm", ["db:embed:senses"]);
  if (embedCode !== 0) {
    console.error("\n❌ Embedding failed. Aborting.");
    process.exit(1);
  }
  console.log("\n✅ Embedding complete!");

  // Step 3: Discover relations
  const continueDiscover = await prompt("Continue to discover relations?");
  if (!continueDiscover) {
    console.log("\n👋 Stopped after embedding.");
    rl.close();
    return;
  }

  const discoverCode = await runCommand("pnpm", ["db:discover:relations"]);
  if (discoverCode !== 0) {
    console.error("\n❌ Relation discovery failed.");
    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Pipeline complete!");
  console.log("=".repeat(60) + "\n");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
