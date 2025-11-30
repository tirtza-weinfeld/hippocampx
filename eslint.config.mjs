import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", ".venv/**"]
},

  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:react-hooks/recommended"),

  {
    rules: {
      // "@typescript-eslint/no-unused-vars": "warn", 
      // "@typescript-eslint/no-explicit-any": "warn",
      // "@typescript-eslint/no-require-imports": "warn",

      // "react-hooks/exhaustive-deps": "warn",
      // "react-hooks/rules-of-hooks": "warn",
      // "react-hooks/preserve-manual-memoization": "warn",
      // "react-hooks/set-state-in-effect": "warn",
      // "react-hooks/refs": "warn",
      // "react-hooks/purity": "warn",
      // "react-hooks/immutability": "warn",
      // "react-hooks/static-components": "warn",
      




         // "@typescript-eslint/no-unused-vars": "warn", 
      // "@typescript-eslint/no-explicit-any": "warn",
      // "@typescript-eslint/no-require-imports": "warn",

      // "react-hooks/exhaustive-deps": "warn",
      // "react-hooks/rules-of-hooks": "warn",
      


      // 'react-hooks/component-hook-factories': 'error',
      // 'react-hooks/config': 'error',
      // 'react-hooks/error-boundaries': 'error',
      // 'react-hooks/gating': 'error',
      // 'react-hooks/globals': 'error',
      // 'react-hooks/immutability': 'error',
      // 'react-hooks/incompatible-library': 'error',
      // 'react-hooks/preserve-manual-memoization': 'error',
      // 'react-hooks/purity': 'error',
      // 'react-hooks/refs': 'error',
      // 'react-hooks/set-state-in-effect': 'error',
      // 'react-hooks/set-state-in-render': 'error',
      // 'react-hooks/static-components': 'error',
      // 'react-hooks/unsupported-syntax': 'error',
      // 'react-hooks/use-memo': 'error'
    }
  }
];

export default eslintConfig;