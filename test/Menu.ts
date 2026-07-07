import Button from "sap/m/Button";
import { ButtonType } from "sap/m/library";
import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import Select from "sap/m/Select";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import NavigationList from "sap/tnt/NavigationList";
import NavigationListItem from "sap/tnt/NavigationListItem";
import SideNavigation from "sap/tnt/SideNavigation";
import ToolHeader from "sap/tnt/ToolHeader";
import ToolPage from "sap/tnt/ToolPage";
import CodeEditor from "sap/ui/codeeditor/CodeEditor";
import type Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";

interface TestPageInfo {
	key: string;
	icon: string;
}

/**
 * All available test pages. The key matches the HTML/TS file name.
 */
const testPages: TestPageInfo[] = [
	{ key: "Button", icon: "sap-icon://cursor-arrow" },
	{ key: "Input", icon: "sap-icon://edit" },
	{ key: "VirtualKeyboard", icon: "sap-icon://keyboard-and-mouse" },
	{ key: "QuantityPicker", icon: "sap-icon://number-sign" },
	{ key: "Text", icon: "sap-icon://text" },
	{ key: "TextArea", icon: "sap-icon://document-text" },
	{ key: "Toolbar", icon: "sap-icon://menu2" },
];

function navigateTo(page: string): void {
	// test pages use <base href="../../../../">, so relative URLs would
	// resolve against the server root — build the URL from the current
	// page's directory instead
	const directory = window.location.pathname.replace(/[^/]*$/, "");
	window.location.href = `${directory}${page}.html`;
}

/**
 * Creates a card containing a read-only code editor that shows example
 * XML view usage of the control demonstrated on the test page.
 *
 * @param code the example XML snippet to display
 * @returns the created Card
 */
export function createExampleCard(code: string): Card {
	const trimmed = code.trim();
	const lines = trimmed.split("\n").length;
	return new Card({
		header: new Header({
			title: "Example Usage (XML View)",
		}),
		content: new CodeEditor({
			value: trimmed,
			type: "xml",
			editable: false,
			lineNumbers: true,
			height: `${lines + 2}rem`,
			width: "100%",
		})
			.addStyleClass("sapUiSmallMarginBegin")
			.addStyleClass("sapUiSmallMarginEnd")
			.addStyleClass("sapUiSmallMarginBottom"),
	}).addStyleClass("sapUiMediumMarginTop");
}

/**
 * Wraps the given content in a ToolPage shell with a side navigation that
 * links all test pages together and places it in the "content" DOM element.
 *
 * @param currentKey key of the current test page (file name without extension)
 * @param content the actual test page content
 * @returns the created ToolPage
 */
export default function initTestPage(
	currentKey: string,
	...content: Control[]
): ToolPage {
	// the ToolPage needs a full-height container
	const style = document.createElement("style");
	style.textContent =
		"html, body, #content { height: 100%; margin: 0; overflow: hidden; } " +
		".sapTntToolPageMain, .sapTntToolPageMainContent { overflow: auto; }";
	document.head.appendChild(style);
	document.title = `ui5.touch.controls — ${currentKey}`;

	const currentIndex = testPages.findIndex((page) => page.key === currentKey);
	const previousPage = currentIndex > 0 ? testPages[currentIndex - 1] : null;
	const nextPage =
		currentIndex >= 0 && currentIndex < testPages.length - 1
			? testPages[currentIndex + 1]
			: null;

	const sideNavigation = new SideNavigation({
		item: new NavigationList({
			items: testPages.map(
				(page) =>
					new NavigationListItem({
						key: page.key,
						text: page.key,
						icon: page.icon,
						select: () => {
							navigateTo(page.key);
						},
					}),
			),
		}),
	});
	sideNavigation.setSelectedKey(currentKey);

	const toolPage = new ToolPage({
		sideExpanded: true,
		header: new ToolHeader({
			content: [
				new Button({
					icon: "sap-icon://menu2",
					type: ButtonType.Transparent,
					tooltip: "Toggle Navigation",
					press: () => {
						toolPage.setSideExpanded(!toolPage.getSideExpanded());
					},
				}),
				new Title({
					text: `ui5.touch.controls — ${currentKey}`,
				}),
				new ToolbarSpacer(),
				new Select({
					tooltip: "Theme",
					selectedKey: sap.ui.getCore().getConfiguration().getTheme(),
					items: [
						new Item({ key: "sap_horizon", text: "Horizon" }),
						new Item({ key: "sap_horizon_dark", text: "Horizon Dark" }),
						new Item({ key: "sap_horizon_hcb", text: "Horizon HCB" }),
						new Item({ key: "sap_horizon_hcw", text: "Horizon HCW" }),
						new Item({ key: "sap_fiori_3", text: "Fiori 3" }),
						new Item({ key: "sap_fiori_3_dark", text: "Fiori 3 Dark" }),
					],
					change: (event) => {
						const selectedKey = event.getParameter("selectedItem")?.getKey();
						if (selectedKey) {
							sap.ui.getCore().applyTheme(selectedKey);
						}
					},
				}),
				new Button({
					icon: "sap-icon://navigation-left-arrow",
					type: ButtonType.Transparent,
					enabled: previousPage !== null,
					tooltip: previousPage ? `Previous: ${previousPage.key}` : "",
					press: () => {
						if (previousPage) {
							navigateTo(previousPage.key);
						}
					},
				}),
				new Button({
					icon: "sap-icon://navigation-right-arrow",
					type: ButtonType.Transparent,
					enabled: nextPage !== null,
					tooltip: nextPage ? `Next: ${nextPage.key}` : "",
					press: () => {
						if (nextPage) {
							navigateTo(nextPage.key);
						}
					},
				}),
			],
		}),
		sideContent: sideNavigation,
		mainContents: content,
	});

	toolPage.placeAt("content");
	return toolPage;
}
