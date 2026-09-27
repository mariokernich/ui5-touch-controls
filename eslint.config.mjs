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
		// QUnit waits for a test that returns a promise - an async test is
		// what the unit tests of the popovers and dialogs are - while its
		// typings still say the callback returns nothing
		files: ["test/unit/**/*.ts"],
		rules: {
			"@typescript-eslint/no-misused-promises": [
				"error",
				{ checksVoidReturn: { arguments: false } },
			],
		},
	},
	{
		// global ignores (standalone object applies to all configs)
		ignores: ["**/*.gen.d.ts"],
	},
);
