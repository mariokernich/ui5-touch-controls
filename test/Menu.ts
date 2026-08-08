import Button from "sap/m/Button";
import { ButtonType } from "sap/m/library";
import Card from "sap/f/Card";
import FormattedText from "sap/m/FormattedText";
import Header from "sap/f/cards/Header";
import Image from "sap/m/Image";
import Link from "sap/m/Link";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import NavigationList from "sap/tnt/NavigationList";
import NavigationListGroup from "sap/tnt/NavigationListGroup";
import NavigationListItem from "sap/tnt/NavigationListItem";
import SideNavigation from "sap/tnt/SideNavigation";
import ToolHeader from "sap/tnt/ToolHeader";
import ToolPage from "sap/tnt/ToolPage";
import CodeEditor from "sap/ui/codeeditor/CodeEditor";
import type Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";
import { TitleLevel } from "sap/ui/core/library";
import Device from "sap/ui/Device";

interface PageInfo {
	/** file name of the page without extension, also used as navigation key */
	key: string;
	/** label shown in the side navigation */
	text: string;
	icon: string;
}

/**
 * Introductory pages shown above the "Controls" group. They explain what the
 * library is, how to install it and how to use it.
 */
const introPages: PageInfo[] = [
	{ key: "GettingStarted", text: "Getting Started", icon: "sap-icon://home" },
	{ key: "Setup", text: "Setup", icon: "sap-icon://wrench" },
	{
		key: "Documentation",
		text: "Documentation",
		icon: "sap-icon://documents",
	},
];

/**
 * One test page per control. The key matches the HTML/TS file name.
 */
const controlPages: PageInfo[] = [
	{ key: "Button", text: "Button", icon: "sap-icon://cursor-arrow" },
	{
		key: "SegmentedButton",
		text: "SegmentedButton",
		icon: "sap-icon://switch-views",
	},
	{ key: "CheckBox", text: "CheckBox", icon: "sap-icon://complete" },
	{ key: "Input", text: "Input", icon: "sap-icon://edit" },
	{
		key: "VirtualKeyboard",
		text: "VirtualKeyboard",
		icon: "sap-icon://keyboard-and-mouse",
	},
	{ key: "StepInput", text: "StepInput", icon: "sap-icon://number-sign" },
	{ key: "Text", text: "Text", icon: "sap-icon://text" },
	{ key: "Link", text: "Link", icon: "sap-icon://chain-link" },
	{ key: "TextArea", text: "TextArea", icon: "sap-icon://document-text" },
	{ key: "Toolbar", text: "Toolbar", icon: "sap-icon://menu2" },
	{
		key: "OverflowToolbar",
		text: "OverflowToolbar",
		icon: "sap-icon://overflow",
	},
	{ key: "QuickDialog", text: "QuickDialog", icon: "sap-icon://message-popup" },
];

/** the order used by the previous/next buttons in the header */
const allPages: PageInfo[] = [...introPages, ...controlPages];

/**
 * Themes that render on a dark background and therefore need the logo
 * variant with the light wordmark.
 */
function isDarkTheme(theme: string): boolean {
	return theme.endsWith("_dark") || theme.endsWith("_hcb");
}

/**
 * Returns the logo matching the given theme. The test pages use
 * <code>&lt;base href="../../../../"&gt;</code>, so the URL is built from the
 * current page's directory instead of a relative one.
 */
function getLogoUrl(theme: string): string {
	const directory = window.location.pathname.replace(/[^/]*$/, "");
	return `${directory}logo${isDarkTheme(theme) ? "-dark" : ""}.svg`;
}

/**
 * Navigates to another page of the demo.
 *
 * @param page file name of the target page without extension
 */
export function navigateTo(page: string): void {
	// test pages use <base href="../../../../">, so relative URLs would
	// resolve against the server root — build the URL from the current
	// page's directory instead
	const directory = window.location.pathname.replace(/[^/]*$/, "");
	window.location.href = `${directory}${page}.html`;
}

/**
 * Creates a large, theme-aware logo, e.g. as a hero image on the
 * "Getting Started" page. The image follows the current theme, so the light
 * wordmark is used on dark backgrounds.
 *
 * @param height CSS height of the logo, defaults to "6rem"
 * @returns the created Image
 */
export function createLogo(height = "6rem"): Image {
	const logo = new Image({
		src: getLogoUrl(sap.ui.getCore().getConfiguration().getTheme()),
		height: height,
		alt: "ui5-touch-controls",
		// otherwise sap.m.Image would look for a logo@2.svg on retina screens
		densityAware: false,
	});

	sap.ui.getCore().attachThemeChanged(() => {
		logo.setSrc(getLogoUrl(sap.ui.getCore().getConfiguration().getTheme()));
	});

	return logo;
}

/**
 * Creates the headline of a page, optionally followed by a short subtitle.
 *
 * @param text the page title
 * @param subtitle an explanatory line below the title, pass an empty string
 *   to omit it
 * @returns a VBox holding the title and the subtitle
 */
export function createPageTitle(text: string, subtitle = ""): VBox {
	const items: Control[] = [
		new Title({ text: text, level: TitleLevel.H1, wrapping: true }),
	];

	if (subtitle) {
		items.push(
			new Text({ text: subtitle }).addStyleClass("sapUiTinyMarginTop"),
		);
	}

	return new VBox({ items: items }).addStyleClass("sapUiSmallMarginBottom");
}

/**
 * Creates a card containing a read-only code editor that shows example
 * usage of the control demonstrated on the test page.
 *
 * @param code the example snippet to display
 * @param language the CodeEditor language type (defaults to "xml");
 *   e.g. use "typescript" for controller-code examples
 * @param title optional card title, defaults to a language specific one
 * @returns the created Card
 */
export function createExampleCard(
	code: string,
	language = "xml",
	title?: string,
): Card {
	const trimmed = code.trim();
	const lines = trimmed.split("\n").length;
	// Note: the value is set via setter instead of constructor settings,
	// because strings containing curly braces (e.g. binding examples like
	// "{/workstation}") would otherwise be parsed as binding syntax and
	// the editor would stay empty.
	const editor = new CodeEditor({
		type: language,
		editable: false,
		lineNumbers: true,
		height: `${lines + 2}rem`,
		width: "100%",
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom");
	editor.setValue(trimmed);
	const defaultTitle =
		language === "xml"
			? "Example Usage (XML View)"
			: "Example Usage (Controller Code)";
	return new Card({
		header: new Header({
			title: title ?? defaultTitle,
		}),
		content: editor,
	}).addStyleClass("sapUiMediumMarginTop");
}

/**
 * Creates a card with a title, an optional subtitle and arbitrary content.
 * Used by the introductory pages so that they look consistent with the
 * control test pages.
 *
 * @param title the card title
 * @param subtitle the card subtitle, pass an empty string to omit it
 * @param content the content controls, stacked vertically
 * @returns the created Card
 */
export function createInfoCard(
	title: string,
	subtitle: string,
	...content: Control[]
): Card {
	return new Card({
		header: new Header({
			title: title,
			subtitle: subtitle,
		}),
		// the VBox is a flex item of the card content, so without an explicit
		// width it shrinks to the intrinsic width of its children — cards that
		// only hold a CodeEditor would collapse to a few characters
		content: new VBox({ width: "100%", items: content })
			.addStyleClass("sapUiSmallMarginBegin")
			.addStyleClass("sapUiSmallMarginEnd")
			.addStyleClass("sapUiSmallMarginBottom"),
	}).addStyleClass("sapUiMediumMarginBottom");
}

/**
 * Creates a paragraph of rich text. Supports the subset of HTML understood by
 * {@link sap.m.FormattedText}, e.g. <code>&lt;b&gt;</code>,
 * <code>&lt;code&gt;</code>, <code>&lt;ul&gt;</code> and <code>&lt;a&gt;</code>.
 *
 * @param html the text to render
 * @returns the created FormattedText
 */
export function createText(html: string): FormattedText {
	return new FormattedText({
		htmlText: html.trim(),
		width: "100%",
	}).addStyleClass("sapUiTinyMarginTop");
}

/**
 * Creates a navigation list item for the given page.
 */
function createNavigationItem(page: PageInfo): NavigationListItem {
	return new NavigationListItem({
		key: page.key,
		text: page.text,
		icon: page.icon,
		select: () => {
			navigateTo(page.key);
		},
	});
}

/**
 * Wraps the given content in a ToolPage shell with a side navigation that
 * links all pages together and places it in the "content" DOM element.
 *
 * @param currentKey key of the current page (file name without extension)
 * @param content the actual page content
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
		".sapTntToolPageMain, .sapTntToolPageMainContent { overflow: auto; } " +
		".touchControlsHeaderLogo { margin-right: 0.75rem; }";
	document.head.appendChild(style);

	const currentPage = allPages.find((page) => page.key === currentKey);
	document.title = `ui5.touch.controls — ${currentPage?.text ?? currentKey}`;

	// the logo replaces the library name in the header and follows the theme
	const logo = new Image({
		src: getLogoUrl(sap.ui.getCore().getConfiguration().getTheme()),
		height: "2rem",
		alt: "ui5-touch-controls",
		tooltip: "Getting Started",
		// otherwise sap.m.Image would look for a logo@2.svg on retina screens
		densityAware: false,
		press: () => {
			navigateTo(introPages[0].key);
		},
	}).addStyleClass("touchControlsHeaderLogo");

	sap.ui.getCore().attachThemeChanged(() => {
		logo.setSrc(getLogoUrl(sap.ui.getCore().getConfiguration().getTheme()));
	});

	const currentIndex = allPages.findIndex((page) => page.key === currentKey);
	const previousPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
	const nextPage =
		currentIndex >= 0 && currentIndex < allPages.length - 1
			? allPages[currentIndex + 1]
			: null;

	const sideNavigation = new SideNavigation({
		item: new NavigationList({
			items: [
				...introPages.map(createNavigationItem),
				// A NavigationListGroup is used instead of a nested
				// NavigationListItem on purpose: sap.tnt does not render icons on
				// second-level items by design, whereas the items of a group stay
				// on the first level and keep their icons.
				new NavigationListGroup({
					text: "Controls",
					expanded: true,
					items: controlPages.map(createNavigationItem),
				}),
			],
		}),
	});
	sideNavigation.setSelectedKey(currentKey);

	const toolPage = new ToolPage({
		// on phones and tablets the side navigation should be collapsed by default
		sideExpanded: Device.system.desktop,
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
				logo,
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
					tooltip: previousPage ? `Previous: ${previousPage.text}` : "",
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
					tooltip: nextPage ? `Next: ${nextPage.text}` : "",
					press: () => {
						if (nextPage) {
							navigateTo(nextPage.key);
						}
					},
				}),
				new Link({
					text: "GitHub",
					tooltip: "Visit the GitHub repository",
					href: "https://github.com/mariokernich/ui5-touch-controls",
					target: "_blank",
				}),
			],
		}),
		sideContent: sideNavigation,
		mainContents: content,
	});

	toolPage.placeAt("content");
	return toolPage;
}
