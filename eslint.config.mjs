import eslint from "@eslint/js";
// import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "backend/**", "next-env.d.ts",
      ".venv/**", "__tests__/**",  "lib/db/**" ,
    "**/problems/mascot/**",
     "**/calculus/**",
     "**/binary/**",
     "**/hadestown/**",
     "**/infinity/**",
     "**/ai/**",
     "**/scripts/**",
     

    ]
  },
  eslint.configs.recommended,
  // ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat["recommended-latest"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Custom rule overrides (commented out)

      // "@typescript-eslint/no-unused-vars": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      // "react-hooks/set-state-in-effect": "off",
      // "react-hooks/purity": "off",


    }
  }
];
