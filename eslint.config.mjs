import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig(
  // React 19.2+ strictest: recommended-latest with React Compiler rules
  reactHooks.configs.flat["recommended-latest"],

  // Next.js 16+ core-web-vitals (includes recommended)
  nextPlugin.configs["core-web-vitals"],

  // TypeScript strict type-checked rules
  tseslint.configs.strictTypeChecked,

  // TypeScript parser options for type-aware linting
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Rule overrides for React 19.2+ patterns
  {
    rules: {
      // React docs recommend: onClick={() => doSomething()}
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      // Safe for integer indices in template literals
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },

  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "backend/**",
    ".venv/**",
    "__tests__/**",
    ".claude/**",
    "**/old/calculus/**",
    "**/old/binary/**",
    "**/old/infinity/**",
    "**/old/ai/**",
    // "**/scripts/**",
  ]),
);
