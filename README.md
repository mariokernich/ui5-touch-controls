# UI5 Library `ui5.touch.controls`

A custom [OpenUI5](https://openui5.org/) control library focused on **touch-friendly controls** — buttons, texts, toolbars, and an on-screen keyboard with generous hit areas and configurable sizes, built with TypeScript.

**Live demo:** https://mariokernich.github.io/ui5-touch-controls/test-resources/ui5/touch/controls/index.html

## Controls

| Control | Description |
| --- | --- |
| `ui5.touch.controls.Button` | A button with configurable size (`S`–`XXXL`), icon, icon position, type (all `sap.m.ButtonType` values), side padding, and width. Fires `press`. |
| `ui5.touch.controls.Input` | An input field with configurable size (`S`–`XXXL`), value state, placeholder, max length, enabled/editable behavior, and width. Fires `change`, `liveChange`, and `submit`. |
| `ui5.touch.controls.QuantityPicker` | A quantity picker composed of a minus button, an input, and a plus button. The `size` property (`S`–`XXXL`) is applied to all three parts together; supports `min`, `max`, `step`, and enabled/editable behavior. Fires `change`. |
| `ui5.touch.controls.Text` | A text control with configurable size (`S`–`XXXL`) and color. Fires `press`. |
| `ui5.touch.controls.TextArea` | A multi-line text input based on `sap.m.TextArea` with touch-friendly size modes (`S`–`XXXL`), rows, max length, value states, and `change` / `liveChange` events. |
| `ui5.touch.controls.Toolbar` | A simple toolbar container with a `content` aggregation for arbitrary controls. |
| `ui5.touch.controls.VirtualKeyboard` | An on-screen keyboard built natively from the library's own `Button` controls (no third-party dependency) with configurable layout, size (`S`–`XXXL`), button type, value binding, max length, and `change` / `keyPress` / `enter` events. |

### `SizeMode`

Shared enum for control sizing: `S`, `M`, `L`, `XL`, `XXL`, `XXXL`.

## Usage

Example with the touch `Button` and `Toolbar`:

```xml
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Toolbar>
		<tc:content>
			<tc:Button
				text="Confirm"
				icon="sap-icon://accept"
				size="XL"
				press=".onPress" />
		</tc:content>
	</tc:Toolbar>
</mvc:View>
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

This starts the dev server (`ui5 serve` with `ui5-test.yaml`) and opens the test page overview. Test pages for the individual controls live in `test/` (e.g. `Button.html`, `Text.html`, `VirtualKeyboard.html`).

### Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Start the local dev server with livereload and open the test pages |
| `npm run build` | Build the library into `dist/` |
| `npm run build:self-contained` | Self-contained build (used for the GitHub Pages deployment) |
| `npm run build:ts-interfaces` | Generate the `*.gen.d.ts` TypeScript interfaces for the controls |
| `npm run check:ts` | TypeScript type check (`tsc --noEmit`) |
| `npm run check:lint` | ESLint check for `src` and `test` |
| `npm run build:icon-font` | Generate the library's icon font (TTF/WOFF/WOFF2 + metadata) from the SVGs in `src/icons` (runs automatically before start/build) |
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

### Icon font

The library ships its own icon font, generated from the SVG files in `src/icons` by `scripts/build-icon-font.mjs` (runs automatically before start/build). The font is registered with the UI5 `IconPool` in `library.ts` under the `touch` collection, so its glyphs can be used through `sap-icon://touch/<icon-name>` and — being real font glyphs — inherit the current text color (`currentColor`), following the theme-aware LESS colors.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy-pages.yml`), which runs the self-contained build and deploys the test pages to GitHub Pages.

## License

Licensed under the [Apache License 2.0](LICENSE).
