import Bar from "sap/m/Bar";
import HBox from "sap/m/HBox";
import Page from "sap/m/Page";
import Panel from "sap/m/Panel";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { FlexAlignItems, FlexWrap } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import Core from "sap/ui/core/Core";
import Item from "sap/ui/core/Item";
import { cases, caseNames, type TestRow } from "./cases";
import { groupedCases, type CaseGroup } from "./groups";
import { originals } from "./originals";

/** the page that is on screen, kept so it can be thrown away and rebuilt */
let page: Page | undefined;

/** the themes the library is built for, as the theme menu offers them */
const THEMES: [string, string][] = [
	["sap_horizon", "Horizon"],
	["sap_horizon_dark", "Horizon Dark"],
	["sap_horizon_hcb", "Horizon HCB"],
	["sap_horizon_hcw", "Horizon HCW"],
	["sap_fiori_3", "Fiori 3"],
	["sap_fiori_3_dark", "Fiori 3 Dark"],
	["sap_fiori_3_hcb", "Fiori 3 HCB"],
	["sap_fiori_3_hcw", "Fiori 3 HCW"],
];

/**
 * Starts the test page and keeps it in step with the hash.
 *
 * Which control is shown comes from the hash - <code>#Button</code> - or from
 * the query string, <code>?control=Button</code>; without either, every
 * control is shown, group after group. The hash is what the UI tests use,
 * because switching by hash rebuilds the page without reloading it, and a
 * reload would take the test bridge with it.
 *
 * The page is put together in code on purpose: no component, no routing, no
 * models, no i18n. The less there is around the controls, the more certain it
 * is that a broken page is the library's doing and not the harness's. For the
 * same reason the look comes from sap.m controls and the theme; test.html only
 * lays them out.
 */
export function run(): void {
	// the UI tests read the catalogue from here instead of keeping a list of
	// their own, so a control that is added to cases.ts is tested by itself
	(window as unknown as { touchTestCases: string[] }).touchTestCases =
		caseNames;
	// the controls whose card shows the sap.m original as well
	(window as unknown as { touchTestOriginals: string[] }).touchTestOriginals =
		caseNames.filter((name) => name in originals);

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
	const groups = groupedCases()
		.map((group) => ({
			title: group.title,
			names: group.names.filter((name) => !requested || name === requested),
		}))
		.filter((group) => group.names.length > 0);

	page = new Page({
		customHeader: header(),
		subHeader: choices(requested),
		content: [
			new VBox({ items: groups.map(groupSection) }).addStyleClass(
				"touchTestContent",
			),
		],
	});
	page.placeAt("content");
}

/** the bar on top: the title and the release the page runs on */
function header(): Bar {
	return new Bar({
		contentLeft: [new Title({ text: "ui5.touch.controls", level: "H1" })],
		contentRight: [new Text({ text: `UI5 ${ui5Version()}`, wrapping: false })],
	});
}

/**
 * The bar below it: which control to show and the theme. A line of its own,
 * so that both stay there on a phone, where a bar would drop its middle.
 */
function choices(requested: string | undefined): Toolbar {
	const controlSelect = new Select({
		// a share of the bar, up to a width of its own, so both menus fit
		// next to each other on a phone as on a desktop
		width: "55%",
		maxWidth: "16rem",
		selectedKey: requested ?? "",
		items: [
			new Item({ key: "", text: "All controls" }),
			...groupedCases().flatMap((group) =>
				group.names.map(
					(name) => new Item({ key: name, text: `${group.title}: ${name}` }),
				),
			),
		],
		change: () => {
			// the hash is what render follows - see run
			window.location.hash = controlSelect.getSelectedKey();
		},
	});

	const themeSelect = new Select({
		width: "40%",
		maxWidth: "12rem",
		selectedKey: theming().getTheme(),
		items: THEMES.map(([key, text]) => new Item({ key, text })),
		change: () => switchTheme(themeSelect.getSelectedKey()),
	});

	return new Toolbar({
		content: [controlSelect, new ToolbarSpacer(), themeSelect],
	});
}

/** a group: its heading and a card for each of its controls */
function groupSection(group: CaseGroup): Control {
	return new VBox({
		items: [
			new Title({
				text: group.title,
				level: "H1",
				titleStyle: "H3",
			}).addStyleClass("touchTestGroupTitle"),
			...group.names.map(card),
		],
	}).addStyleClass("touchTestGroup");
}

/**
 * A card for one control: its name - an H2, which is what the UI tests look
 * for - and a row for each of its cases. A control that replaces one of sap.m
 * shows the original below, under a heading of its own, so the two can be
 * compared; its rows carry touchTestOriginal for the UI tests.
 */
function card(name: string): Control {
	const original = originals[name];

	return new Panel({
		headerToolbar: new Toolbar({
			content: [new Title({ text: name, level: "H2" })],
		}),
		content: [
			...cases[name]().map(row),
			...(original
				? [
						new Title({ text: "sap.m", level: "H3", titleStyle: "H6" }).addStyleClass(
							"touchTestOriginalTitle",
						),
						...original().map((testRow) =>
							row(testRow).addStyleClass("touchTestOriginal"),
						),
					]
				: []),
		],
	}).addStyleClass("touchTestCard");
}

/** one case: the caption on the left, the controls on the right */
function row(testRow: TestRow): Control {
	return new HBox({
		items: [
			new Text({ text: testRow.caption }).addStyleClass("touchTestCaption"),
			new HBox({
				wrap: FlexWrap.Wrap,
				alignItems: FlexAlignItems.Center,
				items: testRow.controls,
			}).addStyleClass("touchTestControls"),
		],
	}).addStyleClass("touchTestRow");
}

/** the parts of sap/ui/core/Theming the page uses */
interface ThemingApi {
	getTheme(): string;
	setTheme(theme: string): void;
}

/** the parts of the Core of UI5 1.102 that stand in for it */
interface LegacyCore {
	getConfiguration(): { getTheme(): string };
	applyTheme(theme: string): void;
}

/**
 * Theming of whichever release the page runs on.
 *
 * sap/ui/core/Theming (1.118) is not imported, as a module that is not there
 * would fail the page on an older release. It is looked up instead, and where
 * it is missing the Core stands in - the way src/compat.ts does it.
 */
function theming(): ThemingApi {
	const modern = sap.ui.require("sap/ui/core/Theming") as
		| ThemingApi
		| undefined;
	if (modern) {
		return modern;
	}

	const core = Core as unknown as LegacyCore;
	return {
		getTheme: () => core.getConfiguration().getTheme(),
		setTheme: (theme) => core.applyTheme(theme),
	};
}

/**
 * Switches the theme, and writes it into the address so that a reload - or
 * the link handed on - opens the page in the same theme.
 */
function switchTheme(theme: string): void {
	theming().setTheme(theme);

	const url = new URL(window.location.href);
	url.searchParams.set("sap-ui-theme", theme);
	window.history.replaceState(null, "", url.toString());
}

/** the release of UI5 the page runs on */
function ui5Version(): string {
	return (sap.ui as unknown as { version: string }).version;
}
