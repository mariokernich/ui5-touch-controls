# UI5 Library `ui5.touch.controls`

A custom [OpenUI5](https://openui5.org/) control library focused on **touch-friendly controls** — buttons, texts, toolbars, and an on-screen keyboard with generous hit areas and configurable sizes, built with TypeScript.

**Live demo:** https://mariokernich.github.io/ui5-touch-controls/test-resources/ui5/touch/controls/index.html

## Controls

| Control | Description |
| --- | --- |
| `ui5.touch.controls.Button` | A button with configurable size (`S`–`XXXL`), icon, icon position, type (all `sap.m.ButtonType` values), side padding, and width. Fires `press`. |
| `ui5.touch.controls.Text` | A text control with configurable size (`S`–`XXXL`) and color. Fires `press`. |
| `ui5.touch.controls.Toolbar` | A simple toolbar container with a `content` aggregation for arbitrary controls. |
| `ui5.touch.controls.Keyboard` | A numeric on-screen keyboard based on [simple-keyboard](https://github.com/hodgef/simple-keyboard). |

### `SizeMode`

Shared enum for control sizing: `S`, `M`, `L`, `XL`, `XXL`, `XXXL`.

## Usage

Example with the touch `Button` and `Toolbar`:

```ts
import Toolbar from "ui5/touch/controls/Toolbar";
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";

const toolbar = new Toolbar({
	content: [
		new Button({
			text: "Confirm",
			icon: "sap-icon://accept",
			size: SizeMode.XL,
			press: () => console.log("pressed"),
		}),
	],
});
```

## Development

### Prerequisites

- Node.js ≥ 24
- [pnpm](https://pnpm.io/)

### Getting started

```sh
pnpm install
npm run start
```

This starts the dev server (`ui5 serve` with `ui5-test.yaml`) and opens the test page overview. Test pages for the individual controls live in `test/` (e.g. `Button.html`, `Text.html`, `Keyboard.html`).

### Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Start the local dev server with livereload and open the test pages |
| `npm run build` | Build the library into `dist/` |
| `npm run build:self-contained` | Self-contained build (used for the GitHub Pages deployment) |
| `npm run build:ts-interfaces` | Generate the `*.gen.d.ts` TypeScript interfaces for the controls |
| `npm run check:ts` | TypeScript type check (`tsc --noEmit`) |
| `npm run check:lint` | ESLint check for `src` and `test` |
| `npm run sync:keyboard-css` | Sync the simple-keyboard stylesheet into the library themes (runs automatically before start/build) |
| `npm run clean` | Remove `dist` and `coverage` |

### Project structure

```
src/                  Library sources (controls, library.ts, themes)
src/themes/           Base + theme-specific LESS files
test/                 Test pages (one HTML + TS pair per control)
scripts/              Build helper scripts
ui5.yaml              UI5 tooling config (library build)
ui5-test.yaml         UI5 tooling config (dev server / test pages)
ui5-self-contained.yaml  UI5 tooling config (self-contained build)
```

### Third-party modules

The library consumes [simple-keyboard](https://github.com/hodgef/simple-keyboard) from npm via [`ui5-tooling-modules`](https://www.npmjs.com/package/ui5-tooling-modules). At build time the module is bundled into the library namespace (`ui5/touch/controls/thirdparty/`), so no manual vendoring is required. Its stylesheet is synced into the theme LESS files via `scripts/sync-keyboard-css.mjs`.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy-pages.yml`), which runs the self-contained build and deploys the test pages to GitHub Pages.

## License

Licensed under the [Apache License 2.0](LICENSE).
