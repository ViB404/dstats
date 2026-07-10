import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
	},
	{
		files: ["**/*.{js,ts}"],
		extends: [js.configs.recommended, tseslint.configs.recommended, reactCompiler.configs.recommended],
	}
);
