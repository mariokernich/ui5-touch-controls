# UI5 Library `ui5.touch.controls`

A custom [OpenUI5](https://openui5.org/) control library focused on **touch-friendly controls** — buttons, texts, toolbars, and an on-screen keyboard with generous hit areas and configurable sizes, built with TypeScript.

The main advantage: the original `sap.m` controls are rebuilt on their original structure and opened up for resizing — for example via a central, easy-to-use `size` property (`S`–`6XL`) that works consistently across all controls of the library.

**Live demo:** https://mariokernich.github.io/ui5-touch-controls/test-resources/ui5/touch/controls/Button.html

**npm package:** https://www.npmjs.com/package/ui5.touch.controls

![Screenshot of the ui5.touch.controls library](docs/screenshot.png)

The controls integrate seamlessly with existing standard controls and aggregations — for example, `Button` and `Text` inside a `sap.m.Table`:

![sap.m.Table using ui5.touch.controls Button and Text controls](docs/table.png)

## Requirements

- UI5 version **1.118 or higher** (OpenUI5 or SAPUI5)

## Installation

The library is published on npm as [`ui5.touch.controls`](https://www.npmjs.com/package/ui5.touch.controls) and can be consumed in any UI5 application that is built with the [UI5 Tooling](https://sap.github.io/ui5-tooling/) (v3 or higher).

### 1. Install the package

Install the library as a **regular dependency** (not a `devDependency`) so the UI5 Tooling picks it up as a project dependency:

```sh
npm install ui5.touch.controls
```

```json
{
	"dependencies": {
		"ui5.touch.controls": "^1.0.2"
	}
}
```

The package ships a `ui5.yaml`, so the UI5 Tooling automatically resolves it as a library dependency.

#### With UI5 middleware (alternative setup)

Instead of consuming the library as a UI5 Tooling project dependency, you can serve it statically with [`ui5-middleware-servestatic`](https://www.npmjs.com/package/ui5-middleware-servestatic):

```sh
npm i ui5.touch.controls && npm i -D ui5-middleware-servestatic
```

Add the following configuration to your `ui5.yaml`:

```yaml
server:
  customMiddleware:
    - name: ui5-middleware-servestatic
      afterMiddleware: compression
      mountPath: /resources/ui5/touch/controls/
      configuration:
        npmPackagePath: 'ui5.touch.controls/dist/resources/ui5/touch/controls'
```

### 2. Add the types to `tsconfig.json`

For TypeScript projects, add the package to the `types` entry in your `tsconfig.json` — otherwise the UI5 Tooling will not load the library automatically:

```json
{
	"compilerOptions": {
		"types": [
			"@sapui5/types",
			"ui5.touch.controls"
		]
	}
}
```

### 3. Declare the library in `manifest.json`

Add the library to the dependencies of your app:

```json
{
	"sap.ui5": {
		"dependencies": {
			"libs": {
				"ui5.touch.controls": {}
			}
		}
	}
}
```

### 4. Use the controls

Add the namespace to your XML views and start using the controls (see [Usage](#usage)):

```xml
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Button text="Hello" size="XL" />
</mvc:View>
```

### TypeScript support

The package includes TypeScript type definitions (`dist/index.d.ts`), so in a TypeScript UI5 app you get full typing out of the box:

```ts
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";

const button = new Button({ text: "Confirm", size: SizeMode.XL });
```

## Controls

| Control | Description |
| --- | --- |
| `ui5.touch.controls.Button` | A button with configurable size (`S`–`6XL`), icon, icon position, type (all `sap.m.ButtonType` values), side padding, and width. Fires `press`. |
| `ui5.touch.controls.Input` | A wrapper around `sap.m.Input` that supports `size` property. |
| `ui5.touch.controls.StepInput` | A step input composed of a minus button, an input, and a plus button. The `size` property (`S`–`6XL`) is applied to all three parts together; supports `min`, `max`, `step`, and enabled/editable behavior. Fires `change`. |
| `ui5.touch.controls.Text` | A text control with configurable size (`S`–`6XL`) and color. Fires `press`. |
| `ui5.touch.controls.TextArea` | A multi-line text input based on `sap.m.TextArea` with touch-friendly size modes (`S`–`6XL`), rows, max length, value states, and `change` / `liveChange` events. |
| `ui5.touch.controls.Toolbar` | A simple toolbar container with a `content` aggregation for arbitrary controls. |
| `ui5.touch.controls.VirtualKeyboard` | An on-screen keyboard built natively from the library's own `Button` controls (no third-party dependency) with configurable layout (incl. `{shift}`, `{space}`, `{bksp}`, `{enter}` special keys), optional real (hardware) keyboard input via `hardwareKeys`, size (`S`–`6XL`), button type, value binding, max length, and `change` / `keyPress` / `enter` events. |

### `SizeMode`

Shared enum for control sizing: `S`, `M`, `L`, `XL`, `2XL`, `3XL`, `4XL`, `5XL`, `6XL`.

### `ISized`

Marker interface (`ui5.touch.controls.ISized`) implemented by every control with a `size` property (`Button`, `Input`, `StepInput`, `Text`, `TextArea`, `VirtualKeyboard`). It allows generic size handling, e.g.:

```ts
if (control.isA<ISized>("ui5.touch.controls.ISized")) {
	control.setSize(SizeMode.XL);
}
```

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
