import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
	{
		ignores: ["**/node_modules/", ".git/", "**/dist/", "**/.next/"],
	},
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		extends: [js.configs.recommended, tseslint.configs.recommended, reactCompiler.configs.recommended],
	}
);
