import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["src/components/ui/**"],
    plugins: {
      prettier,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      // Enforce named exports except for pages/layouts
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
      // Less strict TypeScript rules
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  // Special rules for Next.js config files
  {
    files: [
      "next.config.js",
      "next.config.mjs",
      "next.config.ts",
      "postcss.config.js",
      "postcss.config.mjs",
      "tailwind.config.js",
      "tailwind.config.ts",
    ],
    rules: {
      "import/no-default-export": "off",
      "no-restricted-exports": "off",
    },
  },
  // Special rules for Next.js pages and layouts
  {
    files: [
      "**/page.tsx",
      "**/layout.tsx",
      "**/not-found.tsx",
      "**/error.tsx",
      "**/loading.tsx",
      "**/route.ts",
    ],
    rules: {
      "import/no-default-export": "off",
      "no-restricted-exports": "off",
    },
  },
  // Special rules for components
  {
    files: ["**/components/**/*.tsx", "**/hooks/**/*.tsx", "**/middleware/**/*.tsx"],
    ignores: ["src/components/ui/**"], // Exclude shadcn/ui components
    rules: {
      "import/no-default-export": "error",
      "no-restricted-exports": [
        "error",
        {
          "restrictDefaultExports": {
            "direct": true,
            "named": false,
            "defaultFrom": true,
            "namedFrom": false,
            "namespaceFrom": true
          }
        }
      ],
    },
  }
];

export default eslintConfig;
