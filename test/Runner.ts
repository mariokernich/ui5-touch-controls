import HBox from "sap/m/HBox";
import Page from "sap/m/Page";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import { FlexAlignItems, FlexWrap } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import { cases, caseNames } from "./cases";

/** the page that is on screen, kept so it can be thrown away and rebuilt */
let page: Page | undefined;

/**
 * Starts the test page and keeps it in step with the hash.
 *
 * Which control is shown comes from the hash - <code>#Button</code> - or from
 * the query string, <code>?control=Button</code>; without either, every
 * control is shown, one section after the other. The hash is what the UI tests
 * use, because switching by hash rebuilds the page without reloading it, and a
 * reload would take the test bridge with it.
 *
 * The page is put together in code on purpose: no component, no routing, no
 * models, no i18n. The less there is around the controls, the more certain it
 * is that a broken page is the library's doing and not the harness's.
 */
export function run(): void {
	// the UI tests read the catalogue from here instead of keeping a list of
	// their own, so a control that is added to cases.ts is tested by itself
	(window as unknown as { touchTestCases: string[] }).touchTestCases =
		caseNames;

	window.addEventListener("hashchange", render);
	render();
}

/** The control that was asked for, if it is one the page knows. */
function requestedControl(): string | undefined {
	const fromHash = decodeURIComponent(
		window.location.hash.replace(/^#\/?/, ""),
	);
	if (fromHash in cases) {
		return fromHash;
	}

	const fromQuery = new URLSearchParams(window.location.search).get("control");
	return fromQuery && fromQuery in cases ? fromQuery : undefined;
}

/** Draws the page from scratch. */
function render(): void {
	page?.destroy();

	const requested = requestedControl();
	const names = requested ? [requested] : caseNames;
	const content: Control[] = [];

	for (const name of names) {
		content.push(
			new Title({ text: name, level: "H2" }).addStyleClass(
				"sapUiSmallMarginTop sapUiTinyMarginBottom",
			),
		);

		for (const row of cases[name]()) {
			content.push(
				new Text({ text: row.caption }).addStyleClass("touchTestCaption"),
			);
			content.push(
				new HBox({
					wrap: FlexWrap.Wrap,
					alignItems: FlexAlignItems.Center,
					items: row.controls,
				}).addStyleClass("touchTestRow"),
			);
		}
	}

	page = new Page({
		title: requested
			? `ui5.touch.controls - ${requested}`
			: "ui5.touch.controls - all controls",
		content: [new VBox({ items: content }).addStyleClass("sapUiSmallMargin")],
	});
	page.placeAt("content");
}
