import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".next/**",
      "next-env.d.ts",
      "prisma/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "comma-spacing": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^react$"], ["^next"], ["^@?\\w"], ["^@/"]],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
];
