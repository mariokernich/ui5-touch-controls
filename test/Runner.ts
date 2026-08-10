import HBox from "sap/m/HBox";
import Page from "sap/m/Page";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import { FlexAlignItems, FlexWrap } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import { cases, caseNames } from "./cases";

/**
 * Builds the test page.
 *
 * The control shown comes from the query string - <code>?control=Button</code>
 * - and without one every control is shown, one section after the other. The
 * page is put together in code on purpose: no component, no routing, no
 * models, no i18n. The less there is around the controls, the more certain it
 * is that a broken page is the library's doing and not the harness's.
 */
export function run(): void {
	const requested = new URLSearchParams(window.location.search).get("control");
	const names = requested && cases[requested] ? [requested] : caseNames;

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

	new Page({
		title: requested
			? `ui5.touch.controls - ${requested}`
			: "ui5.touch.controls - all controls",
		content: [new VBox({ items: content }).addStyleClass("sapUiSmallMargin")],
	}).placeAt("content");
}
