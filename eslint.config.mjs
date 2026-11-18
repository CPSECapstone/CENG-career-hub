import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

const eslintConfig = [
  globalIgnores([
    ".next/",
    "out/",
    "coverage/",
    "dist/",
    "build/",
    "supabase/.temp/",
  ]),

  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
