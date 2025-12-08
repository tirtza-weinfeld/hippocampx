import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Next.js Core Web Vitals (includes React, React Hooks, Next.js rules)
  ...nextVitals,

  // Next.js TypeScript configuration
  ...nextTs,

  // typescript-eslint strict type-checked rules (maximum strictness)
  ...tseslint.configs.strictTypeChecked,

  // TypeScript parser options for type-aware linting
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Rule overrides to align with React 19.2+ official patterns
  {
    rules: {
      // React docs recommend: onClick={() => doSomething()}
      "@typescript-eslint/no-confusing-void-expression": ["error", {
        ignoreArrowShorthand: true,
      }],
      // Safe for integer indices in template literals
      "@typescript-eslint/restrict-template-expressions": ["error", {
        allowNumber: true,
      }],
    },
  },

  // Global ignores (overrides eslint-config-next defaults)
  globalIgnores([
    // Default Next.js ignores
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores
    "node_modules/**",
    "backend/**",
    ".venv/**",
    "__tests__/**",
    "**/old/calculus/**",
    "**/old/binary/**",
    "**/old/infinity/**",
    "**/old/ai/**",
    "**/scripts/**",
    "plugins/**",
  ]),
]);
