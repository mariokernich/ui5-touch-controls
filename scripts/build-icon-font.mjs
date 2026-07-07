/*
 * Generates a real icon font (TTF/WOFF/WOFF2) from the SVG files in
 * src/icons together with the UI5 IconPool metadata JSON.
 *
 * Because the SVGs are rendered as an icon font, the glyphs inherit the
 * current text color (currentColor) and therefore follow the theme-aware
 * LESS colors of the Button - unlike an <img>/SVG which stays black.
 *
 * The generated font is registered in library.ts via IconPool.registerFont
 * and can then be used through `sap-icon://touch/<icon-name>` in any control
 * that supports icons (e.g. the VirtualKeyboard control).
 *
 * Runs automatically before build/start (see package.json).
 */
import {
	createReadStream,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SVGIcons2SVGFontStream } from "svgicons2svgfont";
import svg2ttf from "svg2ttf";
import ttf2woff from "ttf2woff";
import { compress } from "wawoff2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const FONT_FAMILY = "ui5-touch-controls-icons";
const COLLECTION = "touch";
const ICON_DIR = resolve(projectRoot, "src/icons");
const OUT_DIR = resolve(projectRoot, "src/themes/base/fonts");

/**
 * Icons to include in the font. The unicode code points live in the
 * Unicode Private Use Area (U+E000+).
 */
const ICONS = [
	{ name: "backspace", file: "backspace.svg", unicode: 0xe000 },
	{ name: "enter", file: "enter.svg", unicode: 0xe001 },
];

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Builds the intermediate SVG font from the individual SVG icons.
 */
function buildSvgFont() {
	return new Promise((resolvePromise, reject) => {
		const chunks = [];
		const fontStream = new SVGIcons2SVGFontStream({
			fontName: FONT_FAMILY,
			normalize: true,
			fontHeight: 1000,
			log: () => {},
		});

		fontStream.on("data", (chunk) => chunks.push(chunk.toString("utf8")));
		fontStream.on("end", () => resolvePromise(chunks.join("")));
		fontStream.on("error", reject);

		for (const icon of ICONS) {
			const glyph = createReadStream(resolve(ICON_DIR, icon.file));
			glyph.metadata = {
				unicode: [String.fromCodePoint(icon.unicode)],
				name: icon.name,
			};
			fontStream.write(glyph);
		}

		fontStream.end();
	});
}

async function main() {
	const svgFont = await buildSvgFont();

	// SVG font -> TTF -> WOFF / WOFF2
	const ttf = Buffer.from(svg2ttf(svgFont, {}).buffer);
	const woff = Buffer.from(ttf2woff(ttf).buffer);
	const woff2 = Buffer.from(await compress(ttf));

	writeFileSync(resolve(OUT_DIR, `${FONT_FAMILY}.ttf`), ttf);
	writeFileSync(resolve(OUT_DIR, `${FONT_FAMILY}.woff`), woff);
	writeFileSync(resolve(OUT_DIR, `${FONT_FAMILY}.woff2`), woff2);

	// UI5 IconPool metadata: maps icon name -> hex code point (without prefix)
	const metadata = Object.fromEntries(
		ICONS.map((icon) => [icon.name, icon.unicode.toString(16)]),
	);
	writeFileSync(
		resolve(OUT_DIR, `${FONT_FAMILY}.json`),
		`${JSON.stringify(metadata, null, "\t")}\n`,
		"utf8",
	);

	console.log(
		`[build-icon-font] Generated ${FONT_FAMILY} (.ttf/.woff/.woff2 + .json) with ${ICONS.length} icons -> ${OUT_DIR}`,
	);
}

main().catch((err) => {
	console.error(`[build-icon-font] Failed: ${err.stack || err.message}`);
	// Keep an existing (previously generated) font if regeneration fails so
	// that build/start does not break on a transient error.
	const existing = resolve(OUT_DIR, `${FONT_FAMILY}.woff2`);
	try {
		readFileSync(existing);
		console.warn("[build-icon-font] Keeping previously generated font.");
	} catch {
		process.exit(1);
	}
});
