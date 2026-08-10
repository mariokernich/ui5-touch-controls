import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				sap: "readonly",
			},
			ecmaVersion: 2023,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		ignores: ["eslint.config.mjs"],
	},
	{
		// The UI tests and the tooling around them are plain Node scripts, not
		// part of the library's TypeScript project, so the rules that need type
		// information cannot apply to them.
		files: ["e2e/**/*.js", "wdio.conf.js", "scripts/**/*.mjs"],
		extends: [tseslint.configs.disableTypeChecked],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
				// put there by WebdriverIO and wdi5 while the tests run
				browser: "readonly",
				$: "readonly",
				$$: "readonly",
				expect: "readonly",
				sap: "readonly",
			},
			parserOptions: { project: null },
		},
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},
	{
		// global ignores (standalone object applies to all configs)
		ignores: ["**/*.gen.d.ts"],
	},
);
