/**
 * One-off migration for the pages that are already an ObjectPageLayout.
 *
 * Two things change:
 *
 * 1. The header link "Open in the UI5 documentation" becomes an attribute that
 *    reads like the one beside it - "Original: sap.m.Button" - and sits right
 *    next to "Extends".
 *
 * 2. The Overview section drops the two columns "The original" / "The touch
 *    version". Those headings said the same thing on every page and the two
 *    short columns read like a table. Instead the section is running text: the
 *    description of the control, what it replaces, and the note that it is a
 *    drop-in replacement.
 *
 * A page keeps anything else that was in its Overview - the Button page for
 * instance ends the section with a MessageStrip - so the block is carried over
 * instead of being dropped.
 *
 * Usage: node scripts/rework-object-page-intro.mjs Button CheckBox ...
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/** the views live in subdirectories by category, see docs/view */
function viewPath(name) {
	for (const dir of ["sapm", "new", "classes", "general"]) {
		const path = `docs/view/${dir}/${name}.view.xml`;

		if (existsSync(path)) {
			return path;
		}
	}

	throw new Error(`${name}: view not found in docs/view/*/`);
}

/**
 * The pages do not agree on which namespace is the default one: the Button page
 * has sap.uxap as default and prefixes sap.m with "m:", the others do it the
 * other way round. Both are valid, so the rewrite adapts instead of forcing one
 * of them.
 */
function prefixes(xml) {
	const uxapIsDefault = /xmlns="sap\.uxap"/.test(xml);

	return uxapIsDefault ? { m: "m:", u: "" } : { m: "", u: "uxap:" };
}

/** the whole <headerContent> of the page, rebuilt */
function headerContent({ m, u }) {
	return `<${u}headerContent>
			<!-- the facts about the class, the way the demo kit lists them -->
			<${m}ObjectAttribute title="{i18n>introExtends}">
				<${m}customContent>
					<${m}Link
						text="{control>/extendsClass}"
						href="{control>/extendsUrl}"
						target="_blank"
						enabled="{= !!\${control>/extendsUrl} }" />
				</${m}customContent>
			</${m}ObjectAttribute>
			<!-- the link to the demo kit reads like the attribute beside it -
			     "Original: sap.m.Button" - instead of being a bare "read more" -->
			<${m}ObjectAttribute title="{i18n>introOriginalLabel}">
				<${m}customContent>
					<${m}Link
						text="{control>/replaces}"
						href="{control>/docUrl}"
						target="_blank"
						enabled="{= !!\${control>/docUrl} }" />
				</${m}customContent>
			</${m}ObjectAttribute>
			<${m}ObjectAttribute title="{i18n>introSince}" text="{control>/since}" />
			<${m}ObjectAttribute
				title="{i18n>introVisibility}"
				text="{control>/visibility}" />
		</${u}headerContent>`;
}

/** the blocks of the Overview section, plus whatever the page added to it */
function overviewBlocks({ m, u }, extra) {
	return `<${u}blocks>
							<!-- running text rather than two columns: the headings
							     "The original" and "The touch version" were on every
							     page and said less than the sentences below them -->
							<${m}VBox width="100%" class="touchControlsProse">
								<${m}Text text="{control>/description}" />
								<${m}Text
									text="{
										parts: ['i18n>overviewReplaces', 'control>/replaces', 'control>/original'],
										formatter: 'formatMessage'
									}"
									class="sapUiSmallMarginTop" />
								<${m}Text
									text="{i18n>introSizeNote}"
									class="sapUiSmallMarginTop" />
							</${m}VBox>${extra ? `\n${extra}` : ""}
						</${u}blocks>`;
}

function rework(name) {
	const path = viewPath(name);
	let xml = readFileSync(path, "utf8");

	if (!xml.includes("ObjectPageLayout")) {
		return `${name}: not an object page, skipped`;
	}

	const p = prefixes(xml);

	// 1. the header
	const header = new RegExp(`\\t*<${p.u}headerContent>[\\s\\S]*?</${p.u}headerContent>`);

	if (!header.test(xml)) {
		throw new Error("no headerContent found");
	}

	xml = xml.replace(header, `\t\t${headerContent(p)}`);

	// 2. the Overview section - only the blocks inside it, so the section and
	//    its title stay untouched
	const overview = new RegExp(
		`(<${p.u}ObjectPageSection title="\\{i18n>sectionOverview\\}">[\\s\\S]*?)` +
			`\\t*<${p.u}blocks>([\\s\\S]*?)</${p.u}blocks>`,
	);
	const match = xml.match(overview);

	if (!match) {
		throw new Error("no Overview blocks found");
	}

	// anything the page put into the section besides the two columns - the
	// MessageStrip of the Button page - is kept
	const strip = match[2].match(/\t*<m?:?MessageStrip[\s\S]*?<\/m?:?MessageStrip>/);
	const extra = strip
		? strip[0]
				.replace(/^\n+|\s+$/g, "")
				.split("\n")
				.map((l) => (l.trim() ? `\t\t\t\t\t\t\t${l.trim()}` : ""))
				.join("\n")
		: "";

	xml = xml.replace(overview, `$1\t\t\t\t\t\t${overviewBlocks(p, extra)}`);

	// the comment above the section described the two columns
	xml = xml.replace(
		/<!-- Overview: what the sap\.m original is and what this library made\s*\n\s*of it, the two next to each other -->/,
		"<!-- Overview: the control in running text, longer than the summary in\n\t\t\t     the head of the page -->",
	);

	// 3. formatMessage has to be required for the pattern above
	if (!xml.includes("formatMessage")) {
		throw new Error("formatter not written");
	}

	if (!xml.includes("core:require")) {
		xml = xml.replace(
			/(\n\theight="100%">)/,
			'\n\tcore:require="{ formatMessage: \'sap/base/strings/formatMessage\' }"$1',
		);
	}

	writeFileSync(path, xml);
	return `${name}: reworked${strip ? " (kept MessageStrip)" : ""}`;
}

for (const name of process.argv.slice(2)) {
	try {
		console.log(rework(name));
	} catch (error) {
		console.log(`${name}: FAILED - ${error.message}`);
	}
}
