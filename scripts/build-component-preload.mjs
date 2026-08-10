/**
 * Writes the Component-preload.js of the demo application.
 *
 * UI5 asks for this file before it starts loading a component module by
 * module. Without it the demo costs one request per view, per controller and
 * per model file - on the first screen and again on every page the visitor
 * walks to.
 *
 * The UI5 tooling cannot produce it here. Its bundler reads from /resources/
 * and writes to /resources/, and the demo of a library lives in
 * /test-resources/ - so the bundle would neither find its input nor land where
 * the component is looked up. The format it would write is a single call
 * though, which is what this script does after the build:
 *
 *     sap.ui.require.preload({
 *         "ui5/touch/controls/demo/Component.js": function () { ... },
 *         "ui5/touch/controls/demo/view/App.view.xml": "<mvc:View ...>",
 *     }, "ui5/touch/controls/demo/Component-preload");
 *
 * A module is a function so that it is only executed when it is required; an
 * XML view or a properties file goes in as the string it is.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const demoRoot = join(
	projectRoot,
	"dist",
	"test-resources",
	"ui5",
	"touch",
	"controls",
);

/** the namespace the demo is loaded under, see index.html */
const NAMESPACE = "ui5/touch/controls/demo";

/** what belongs in the bundle: everything the component loads as a module */
const BUNDLED = [".js", ".xml", ".properties", ".json"];

/**
 * What must stay out: the sources and source maps the build keeps next to the
 * result, the debug variants, and the two files UI5 reads before the preload
 * is loaded at all.
 */
function isBundled(path) {
	if (path.endsWith(".d.ts") || path.endsWith(".ts") || path.endsWith(".map")) {
		return false;
	}
	if (path.endsWith("-dbg.js")) {
		return false;
	}
	if (path === "manifest.json" || path === "Component-preload.js") {
		return false;
	}

	return BUNDLED.some((extension) => path.endsWith(extension));
}

/** Every file below a directory, as paths relative to it. */
function filesIn(directory) {
	const found = [];

	for (const entry of readdirSync(directory)) {
		const path = join(directory, entry);

		if (statSync(path).isDirectory()) {
			found.push(...filesIn(path));
		} else {
			found.push(path);
		}
	}

	return found;
}

const modules = filesIn(demoRoot)
	.map((path) => relative(demoRoot, path).split("\\").join("/"))
	.filter(isBundled)
	.sort();

if (modules.length === 0) {
	throw new Error(`no demo files to bundle - is ${demoRoot} built?`);
}

const entries = modules.map((module) => {
	const content = readFileSync(join(demoRoot, module), "utf8");
	const name = JSON.stringify(`${NAMESPACE}/${module}`);

	return module.endsWith(".js")
		? `${name}:function(){${content}\n}`
		: `${name}:${JSON.stringify(content)}`;
});

const bundle = `sap.ui.require.preload({\n${entries.join(",\n")}\n},"${NAMESPACE}/Component-preload");\n`;
const target = join(demoRoot, "Component-preload.js");

writeFileSync(target, bundle);

console.log(
	`Component-preload.js: ${modules.length} modules, ${(bundle.length / 1024).toFixed(0)} kB`,
);
