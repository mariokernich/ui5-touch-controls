import {
	ButtonType,
	FlexAlignItems,
	OverflowToolbarPriority,
} from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import Page from "sap/m/Page";
import Select from "sap/m/Select";
import Slider from "sap/m/Slider";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import HBox from "sap/m/HBox";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/touch/controls/Button";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel({
	size: SizeMode.XL,
});

const sizeSelect = new HBox({
	alignItems: FlexAlignItems.Center,
	items: [
		new Text({ text: "Button size", width: "100px" }),
		new Select({
			selectedKey: "{json>/size}",
			items: [
				new Item({ key: "S", text: "S" }),
				new Item({ key: "M", text: "M" }),
				new Item({ key: "L", text: "L" }),
				new Item({ key: "XL", text: "XL" }),
				new Item({ key: "2XL", text: "2XL" }),
				new Item({ key: "3XL", text: "3XL" }),
				new Item({ key: "4XL", text: "4XL" }),
				new Item({ key: "5XL", text: "5XL" }),
				new Item({ key: "6XL", text: "6XL" }),
			],
		}),
	],
}).addStyleClass("sapUiTinyMarginBottom");

/**
 * Creates a demo button that just reports its press.
 */
function createButton(
	text: string,
	icon: string,
	type: ButtonType,
	priority?: OverflowToolbarPriority,
): SizedButton {
	const button = new SizedButton({
		text: text,
		icon: icon,
		type: type,
		size: "{json>/size}",
		press: () => {
			MessageToast.show(`"${text}" pressed`);
		},
	});

	if (priority) {
		button.setLayoutData(new OverflowToolbarLayoutData({ priority: priority }));
	}

	return button;
}

function createSectionTitle(text: string): Title {
	return new Title({ text: text })
		.addStyleClass("sapUiMediumMarginTop")
		.addStyleClass("sapUiTinyMarginBottom");
}

function createHint(text: string): Text {
	return new Text({ text: text }).addStyleClass("sapUiTinyMarginTop");
}

// 1) the default case: no layout data at all, so the overflow button only
//    shows up once the content really does not fit any more
const plainToolbar = new OverflowToolbar({
	size: "{json>/size}",
	content: [
		createButton("New", "sap-icon://add", ButtonType.Emphasized),
		createButton("Edit", "sap-icon://edit", ButtonType.Default),
		createButton("Copy", "sap-icon://copy", ButtonType.Default),
		createButton("Share", "sap-icon://share", ButtonType.Default),
		new ToolbarSpacer(),
		createButton("Delete", "sap-icon://delete", ButtonType.Reject),
	],
});

// 2) the same toolbar, but with overflow priorities
const priorityToolbar = new OverflowToolbar({
	size: "{json>/size}",
	content: [
		createButton(
			"Print (Low)",
			"sap-icon://print",
			ButtonType.Default,
			OverflowToolbarPriority.Low,
		),
		createButton("Export", "sap-icon://excel-attachment", ButtonType.Default),
		createButton(
			"Save (Never)",
			"sap-icon://save",
			ButtonType.Emphasized,
			OverflowToolbarPriority.NeverOverflow,
		),
		new ToolbarSpacer(),
		createButton(
			"About (Always)",
			"sap-icon://hint",
			ButtonType.Ghost,
			OverflowToolbarPriority.AlwaysOverflow,
		),
	],
});

// both toolbars live in a container whose width can be changed with a slider,
// so the overflow behaviour can be compared directly
const resizableContainer = new VBox({
	width: "100%",
	items: [
		createSectionTitle("Without priorities"),
		plainToolbar,
		createHint(
			"Drag the slider to the left: the content that does not fit any more moves behind the button with the three dots. At full width there is no overflow button at all.",
		),
		createSectionTitle("With overflow priorities"),
		priorityToolbar,
		createHint(
			'"Print" has priority Low and therefore overflows first. "Save" has NeverOverflow and stays in the toolbar as long as there is room for it at all — at the smallest width it moves into the popover too, so the overflow button stays reachable. "About" has AlwaysOverflow and is always in the popover — that is why this toolbar shows the button with the three dots even when there is plenty of space.',
		),
	],
});

const widthSlider = new HBox({
	alignItems: FlexAlignItems.Center,
	items: [
		new Text({ text: "Toolbar width", width: "100px" }),
		new Slider({
			min: 20,
			max: 100,
			value: 100,
			width: "20rem",
			liveChange: (event) => {
				resizableContainer.setWidth(`${event.getParameter("value")}%`);
			},
		}),
	],
}).addStyleClass("sapUiSmallMarginBottom");

// live example: a sap.m.Page with the OverflowToolbar as footer — the Page
// needs an explicit height, otherwise it collapses inside the VBox
const style = document.createElement("style");
style.textContent = ".overflowToolbarDemoPage { height: 20rem; }";
document.head.appendChild(style);

const demoPage = new Page({
	title: "Page with an OverflowToolbar as footer",
	showFooter: true,
	footer: new OverflowToolbar({
		size: "{json>/size}",
		content: [
			createButton("Save", "sap-icon://save", ButtonType.Emphasized),
			createButton("Cancel", "sap-icon://decline", ButtonType.Default),
			new ToolbarSpacer(),
			createButton("Approve", "sap-icon://accept", ButtonType.Accept),
			createButton("Reject", "sap-icon://decline", ButtonType.Reject),
			createButton("History", "sap-icon://history", ButtonType.Default),
		],
	}),
}).addStyleClass("overflowToolbarDemoPage");

const page = new VBox({
	items: [
		sizeSelect,
		widthSlider,
		resizableContainer,
		createSectionTitle("As a footer"),
		new VBox({ items: [demoPage] }),
		createHint(
			"Make the browser window narrower to see the footer toolbar overflow — the popover then opens above the toolbar.",
		),
		createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page showFooter="true">
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button
					text="New"
					type="Emphasized"
					icon="sap-icon://add"
					size="XL"
					press=".onNew" />
				<tc:Button
					text="Edit"
					icon="sap-icon://edit"
					size="XL"
					press=".onEdit" />
				<ToolbarSpacer />
				<tc:Button
					text="Delete"
					type="Reject"
					icon="sap-icon://delete"
					size="XL"
					press=".onDelete">
					<tc:layoutData>
						<OverflowToolbarLayoutData priority="NeverOverflow" />
					</tc:layoutData>
				</tc:Button>
			</tc:OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
`),
	],
}).addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("OverflowToolbar", page);
