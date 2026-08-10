/**
 * Prints the UI5 versions the library is tested against, as JSON.
 *
 * The versions are not written down here: they are read out of the
 * `start:test*` scripts in package.json, which are what a developer uses to
 * open the test page on a release. That way the workflow and the scripts
 * cannot drift apart - adding a start:test:1.118 script is all it takes to
 * have CI cover 1.118 as well.
 *
 * Each entry is { name, version }, with an empty version standing for the one
 * pinned in ui5-test.yaml.
 *
 *     node scripts/ui5-versions.mjs
 *     [{"name":"latest","version":""},{"name":"1.116","version":"1.116.0"}, ...]
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { scripts } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const versions = Object.entries(scripts)
	.filter(([name]) => name === "start:test" || name.startsWith("start:test:"))
	.map(([name, command]) => ({
		name: name === "start:test" ? "latest" : name.replace("start:test:", ""),
		version: /--framework-version\s+(\S+)/.exec(command)?.[1] ?? "",
	}));

process.stdout.write(JSON.stringify(versions));
