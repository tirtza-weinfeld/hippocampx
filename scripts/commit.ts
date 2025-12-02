#!/usr/bin/env tsx
/**
 * Interactive commit helper following Conventional Commits specification
 * https://www.conventionalcommits.org/
 */

import { execSync, spawnSync } from "child_process";
import * as readline from "readline";

// ANSI Color codes
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Bright foreground colors
  brightBlack: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",

  // Background colors
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

// Helper functions for colored output
function c(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

function dim(text: string): string {
  return `${colors.dim}${text}${colors.reset}`;
}

interface CommitType {
  type: string;
  description: string;
  emoji: string;
  color: keyof typeof colors;
}

const COMMIT_TYPES: CommitType[] = [
  { type: "feat", description: "New feature or functionality", emoji: "✨", color: "brightGreen" },
  { type: "fix", description: "Bug fix", emoji: "🐛", color: "brightRed" },
  { type: "docs", description: "Documentation changes only", emoji: "📚", color: "brightBlue" },
  { type: "style", description: "Code style (formatting, semicolons, etc.)", emoji: "💎", color: "brightMagenta" },
  { type: "refactor", description: "Code change that neither fixes a bug nor adds a feature", emoji: "🔃", color: "brightCyan" },
  { type: "perf", description: "Performance improvement", emoji: "⚡", color: "brightYellow" },
  { type: "test", description: "Adding or updating tests", emoji: "🧪", color: "green" },
  { type: "build", description: "Build system or external dependencies", emoji: "📦", color: "yellow" },
  { type: "ci", description: "CI/CD configuration changes", emoji: "🔧", color: "cyan" },
  { type: "chore", description: "Maintenance tasks, no production code change", emoji: "🔨", color: "brightBlack" },
  { type: "revert", description: "Revert a previous commit", emoji: "⏪", color: "red" },
];

function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function getStagedFiles(): string {
  try {
    return execSync("git diff --cached --name-status", { encoding: "utf-8" });
  } catch {
    return "";
  }
}

function detectScopes(staged: string): string[] {
  const files = staged
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t")[1])
    .filter(Boolean);

  const scopeCount = new Map<string, number>();

  for (const file of files) {
    const parts = file.split("/");

    // Detect test files - normalize to "test"
    if (file.includes(".test.") || file.includes("__tests__") || file.includes(".spec.")) {
      scopeCount.set("test", (scopeCount.get("test") || 0) + 1);
      continue; // Don't also count __tests__ as a directory
    }

    // Top-level directory as scope (skip common non-descriptive ones)
    if (parts.length > 1) {
      const topDir = parts[0];
      // Skip directories that aren't useful as scopes
      if (!["node_modules", "dist", "build", ".git", "__tests__"].includes(topDir)) {
        scopeCount.set(topDir, (scopeCount.get(topDir) || 0) + 1);
      }
    }
  }

  // Sort by frequency and return top scopes
  return Array.from(scopeCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([scope]) => scope);
}

function getUnstagedFiles(): string {
  try {
    return execSync("git status --short", { encoding: "utf-8" });
  } catch {
    return "";
  }
}

function getPartiallyStaged(): string[] {
  try {
    const status = execSync("git status --short", { encoding: "utf-8" });
    return status
      .split("\n")
      .filter((line) => {
        if (line.length < 3) return false;
        // Files with both staged and unstaged changes (e.g., "MM", "AM")
        const index = line[0];   // staged status
        const worktree = line[1]; // unstaged status
        return index !== " " && index !== "?" && worktree !== " " && worktree !== "?";
      })
      .map((line) => line.substring(3))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function displayCommitTypes(): void {
  console.log(`\n${c("brightCyan", "📋 Commit Types")} ${dim("(Conventional Commits)")}\n`);
  console.log(dim("─".repeat(70)));

  COMMIT_TYPES.forEach((item, index) => {
    const num = c("brightWhite", String(index + 1).padStart(2, " "));
    const typeStr = c(item.color, bold(item.type.padEnd(12)));
    const separator = dim("│");
    console.log(`  ${num}. ${item.emoji} ${typeStr} ${separator} ${dim(item.description)}`);
  });

  console.log(dim("─".repeat(70)));
}

function displayStagedFiles(staged: string): void {
  if (staged) {
    console.log(`\n${c("brightYellow", "📁 Staged files:")}`);
    console.log(dim("─".repeat(50)));
    staged.split("\n").filter(Boolean).forEach((line) => {
      const [status, ...fileParts] = line.split("\t");
      const file = fileParts.join("\t");
      let statusIcon: string;
      let statusColor: keyof typeof colors;

      switch (status) {
        case "M":
          statusIcon = "●";
          statusColor = "brightYellow";
          break;
        case "A":
          statusIcon = "+";
          statusColor = "brightGreen";
          break;
        case "D":
          statusIcon = "−";
          statusColor = "brightRed";
          break;
        case "R":
          statusIcon = "→";
          statusColor = "brightCyan";
          break;
        case "C":
          statusIcon = "◆";
          statusColor = "brightBlue";
          break;
        default:
          statusIcon = "○";
          statusColor = "white";
      }

      console.log(`  ${c(statusColor, statusIcon)}  ${dim("│")} ${c(statusColor, file)}`);
    });
    console.log(dim("─".repeat(50)));
  } else {
    console.log(`\n${c("brightYellow", "⚠️  No files staged for commit.")}`);
    console.log(`   ${dim("Use")} ${c("cyan", "git add <file>")} ${dim("to stage changes.")}\n`);
  }
}

async function stageFiles(rl: readline.Interface): Promise<boolean> {
  const unstaged = getUnstagedFiles();

  if (!unstaged) {
    console.log(dim("No changes to stage."));
    return false;
  }

  console.log(`\n${c("brightMagenta", "📂 Unstaged & untracked changes:")}`);
  console.log(dim("─".repeat(50)));
  unstaged.split("\n").filter(Boolean).forEach((line) => {
    const status = line.substring(0, 2);
    const file = line.substring(3);
    let statusIcon: string;
    let statusColor: keyof typeof colors;
    let statusLabel: string;

    if (status === "??" || status === "? ") {
      statusIcon = "★";
      statusColor = "brightBlue";
      statusLabel = "new     ";
    } else if (status[1] === "M" || status === "MM") {
      statusIcon = "●";
      statusColor = "brightYellow";
      statusLabel = "modified";
    } else if (status[1] === "D") {
      statusIcon = "−";
      statusColor = "brightRed";
      statusLabel = "deleted ";
    } else if (status === " A" || status === "A ") {
      statusIcon = "+";
      statusColor = "brightGreen";
      statusLabel = "added   ";
    } else {
      statusIcon = "○";
      statusColor = "white";
      statusLabel = "changed ";
    }

    console.log(`  ${c(statusColor, statusIcon)} ${c(statusColor, statusLabel)} ${dim("│")} ${file}`);
  });
  console.log(dim("─".repeat(50)));

  const stageAll = await prompt(rl, `\nStage all changes? (${c("green", "y")}/${c("red", "n")}/${c("yellow", "q")} to quit): `);

  if (stageAll.toLowerCase() === "q") {
    return false;
  }

  if (stageAll.toLowerCase() === "y") {
    execSync("git add -A");
    console.log(`${c("brightGreen", "✅ All changes staged.")}`);
    return true;
  }

  const files = await prompt(rl, `Enter files to stage ${dim("(space-separated)")} or ${c("yellow", "'q'")} to quit: `);

  if (files.toLowerCase() === "q") {
    return false;
  }

  if (files) {
    execSync(`git add ${files}`);
    console.log(`${c("brightGreen", "✅ Selected files staged.")}`);
    return true;
  }

  return false;
}

function displayBanner(): void {
  const banner = `
${c("brightCyan", "╔══════════════════════════════════════════════════════════════╗")}
${c("brightCyan", "║")}  ${c("brightWhite", "🚀 Git Commit Helper")}                                        ${c("brightCyan", "║")}
${c("brightCyan", "║")}  ${dim("Following Conventional Commits specification")}                 ${c("brightCyan", "║")}
${c("brightCyan", "║")}  ${dim("https://www.conventionalcommits.org/")}                         ${c("brightCyan", "║")}
${c("brightCyan", "╚══════════════════════════════════════════════════════════════╝")}`;
  console.log(banner);
}

function displayCommitPreview(fullMessage: string, selectedType: CommitType): void {
  console.log(`\n${c("brightMagenta", "📝 Commit Preview:")}`);
  console.log(c("brightBlack", "═".repeat(60)));

  const lines = fullMessage.split("\n");
  // First line is the header - highlight it with the type's color
  if (lines.length > 0) {
    console.log(c(selectedType.color, bold(lines[0])));
    // Rest of the message
    if (lines.length > 1) {
      lines.slice(1).forEach((line) => {
        if (line.startsWith("BREAKING CHANGE:")) {
          console.log(c("brightRed", bold(line)));
        } else {
          console.log(dim(line));
        }
      });
    }
  }

  console.log(c("brightBlack", "═".repeat(60)));
}

async function run(): Promise<void> {
  const rl = createInterface();

  displayBanner();

  // Check staged files
  let staged = getStagedFiles();

  if (!staged) {
    const shouldStage = await stageFiles(rl);
    if (!shouldStage) {
      console.log(`\n${c("yellow", "👋 Commit cancelled.")}\n`);
      rl.close();
      return;
    }
    staged = getStagedFiles();
  }

  displayStagedFiles(staged);

  if (!staged) {
    rl.close();
    return;
  }

  // Check for partially staged files
  const partiallyStaged = getPartiallyStaged();
  if (partiallyStaged.length > 0) {
    console.log(`\n${c("brightYellow", "⚠️  Warning:")} ${c("yellow", "Some files have unstaged changes that won't be committed:")}`);
    console.log(dim("─".repeat(50)));
    partiallyStaged.forEach((file) => {
      console.log(`  ${c("brightYellow", "●")} ${file}`);
    });
    console.log(dim("─".repeat(50)));

    const restage = await prompt(rl, `\nRe-stage these files to include latest changes? (${c("green", "y")}/${c("red", "n")}): `);
    if (restage.toLowerCase() === "y") {
      partiallyStaged.forEach((file) => {
        execSync(`git add "${file}"`);
      });
      console.log(`${c("brightGreen", "✅ Files re-staged with latest changes.")}`);
      staged = getStagedFiles();
      displayStagedFiles(staged);
    }
  }

  displayCommitTypes();

  // Get commit type
  const typeInput = await prompt(rl, `\n${c("brightWhite", "Select commit type")} ${dim("(1-11, name, or custom)")}: `);

  if (!typeInput) {
    console.log(`\n${c("yellow", "👋 Commit cancelled.")}\n`);
    rl.close();
    return;
  }

  let selectedType: CommitType;
  const typeNum = parseInt(typeInput, 10);

  if (!isNaN(typeNum) && typeNum >= 1 && typeNum <= COMMIT_TYPES.length) {
    selectedType = COMMIT_TYPES[typeNum - 1];
  } else {
    const found = COMMIT_TYPES.find((t) => t.type === typeInput.toLowerCase());
    if (found) {
      selectedType = found;
    } else {
      // Custom type
      selectedType = {
        type: typeInput.toLowerCase(),
        description: "Custom commit type",
        emoji: "📌",
        color: "brightWhite",
      };
    }
  }

  console.log(`\n${c("brightGreen", "✅ Selected:")} ${selectedType.emoji} ${c(selectedType.color, bold(selectedType.type))}`);

  // Get optional scope with suggestions
  const suggestedScopes = detectScopes(staged);
  let scopePrompt = `\n${c("brightWhite", "Scope")} ${dim("(optional, press Enter to skip)")}`;
  if (suggestedScopes.length > 0) {
    const scopeList = suggestedScopes.map((s, i) => `${c("cyan", `${i + 1}`)}=${c("brightCyan", s)}`).join("  ");
    console.log(`${scopePrompt}`);
    console.log(`  ${dim("Suggested:")} ${scopeList}`);
    scopePrompt = `  ${dim("Enter number, name, or skip")}: `;
  } else {
    scopePrompt += ": ";
  }

  const scopeInput = await prompt(rl, scopePrompt);
  let scope = "";

  if (scopeInput) {
    const scopeNum = parseInt(scopeInput, 10);
    if (!isNaN(scopeNum) && scopeNum >= 1 && scopeNum <= suggestedScopes.length) {
      scope = suggestedScopes[scopeNum - 1];
    } else {
      scope = scopeInput;
    }
  }

  if (scope) {
    console.log(`  ${c("brightGreen", "✓")} ${dim("Scope:")} ${c("brightCyan", scope)}`);
  }

  // Get commit message
  const message = await prompt(rl, `\n${c("brightWhite", "Commit message")} ${dim("(imperative mood, e.g., 'add user login')")}: `);

  if (!message) {
    console.log(`\n${c("brightRed", "❌ Commit message is required.")}\n`);
    rl.close();
    return;
  }

  // Get optional body
  const hasBody = await prompt(rl, `\n${c("brightWhite", "Add detailed description?")} (${c("green", "y")}/${c("red", "n")}): `);
  let body = "";

  if (hasBody.toLowerCase() === "y") {
    console.log(`${c("brightWhite", "Description")} ${dim("(enter text, blank line to finish):")}`)
    const lines: string[] = [];
    let line = await prompt(rl, `  ${dim(">")} `);
    while (line !== "") {
      lines.push(line);
      line = await prompt(rl, `  ${dim(">")} `);
    }
    body = lines.join("\n");
  }

  // Check for breaking change
  const isBreaking = await prompt(rl, `\n${c("brightRed", "⚠️  Is this a BREAKING CHANGE?")} (${c("green", "y")}/${c("red", "n")}): `);
  const breaking = isBreaking.toLowerCase() === "y";

  // Build commit message
  const scopePart = scope ? `(${scope})` : "";
  const breakingMark = breaking ? "!" : "";
  const commitHeader = `${selectedType.type}${scopePart}${breakingMark}: ${message}`;

  let fullMessage = commitHeader;

  if (body) {
    fullMessage += `\n\n${body}`;
  }

  if (breaking) {
    const breakingDesc = await prompt(rl, `${c("brightRed", "Describe the breaking change")}: `);
    fullMessage += `\n\nBREAKING CHANGE: ${breakingDesc}`;
  }

  // Preview commit
  displayCommitPreview(fullMessage, selectedType);

  const confirm = await prompt(rl, `\n${c("brightWhite", "Proceed with commit?")} (${c("green", "y")}/${c("red", "n")}): `);

  if (confirm.toLowerCase() !== "y") {
    console.log(`\n${c("yellow", "👋 Commit cancelled.")}\n`);
    rl.close();
    return;
  }

  // Execute commit
  console.log(`\n${c("cyan", "⏳ Creating commit...")}`);

  try {
    const result = spawnSync("git", ["commit", "-m", fullMessage], {
      stdio: "inherit",
      encoding: "utf-8",
    });

    if (result.status === 0) {
      console.log(`\n${c("brightGreen", "═".repeat(50))}`);
      console.log(`${c("brightGreen", "✅ Commit created successfully!")}`);
      console.log(`${c("brightGreen", "═".repeat(50))}`);

      // Offer to push
      const shouldPush = await prompt(rl, `\n${c("brightWhite", "Push to remote?")} (${c("green", "y")}/${c("red", "n")}): `);

      if (shouldPush.toLowerCase() === "y") {
        console.log(`\n${c("cyan", "⏳ Pushing to remote...")}`);
        const pushResult = spawnSync("git", ["push"], {
          stdio: "inherit",
          encoding: "utf-8",
        });

        if (pushResult.status === 0) {
          console.log(`\n${c("brightGreen", "✅ Pushed successfully!")}\n`);
        } else {
          console.log(`\n${c("brightRed", "❌ Push failed.")}\n`);
        }
      } else {
        console.log("");
      }
    } else {
      console.log(`\n${c("brightRed", "❌ Commit failed.")}\n`);
    }
  } catch (error) {
    console.error(`\n${c("brightRed", "❌ Error creating commit:")}`, error);
  }

  rl.close();
}

run().catch(console.error);
