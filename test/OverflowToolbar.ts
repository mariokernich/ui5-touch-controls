import { ButtonType, FlexAlignItems, OverflowToolbarPriority } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import Page from "sap/m/Page";
import Select from "sap/m/Select";
import Slider from "sap/m/Slider";
import Text from "sap/m/Text";
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

// the toolbar of the first example lives in a container whose width can be
// changed with a slider, so the overflow behaviour can be tried out
const resizableToolbar = new OverflowToolbar({
	size: "{json>/size}",
	content: [
		createButton("New", "sap-icon://add", ButtonType.Emphasized),
		createButton("Edit", "sap-icon://edit", ButtonType.Default),
		createButton("Copy", "sap-icon://copy", ButtonType.Default),
		createButton("Share", "sap-icon://share", ButtonType.Default),
		createButton("Delete", "sap-icon://delete", ButtonType.Reject),
		new ToolbarSpacer(),
		createButton(
			"Settings",
			"sap-icon://action-settings",
			ButtonType.Ghost,
			OverflowToolbarPriority.NeverOverflow,
		),
		createButton(
			"About",
			"sap-icon://hint",
			ButtonType.Ghost,
			OverflowToolbarPriority.AlwaysOverflow,
		),
	],
});

const resizableContainer = new VBox({
	width: "100%",
	items: [resizableToolbar],
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
		new Text({
			text: "Make the toolbar smaller — the content that does not fit any more is moved behind the button with the three dots.",
		}).addStyleClass("sapUiSmallMarginTop"),
		new VBox({ items: [demoPage] }).addStyleClass("sapUiMediumMarginTop"),
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
					press=".onNew" />
				<tc:Button
					text="Edit"
					icon="sap-icon://edit"
					press=".onEdit" />
				<ToolbarSpacer />
				<tc:Button
					text="Delete"
					type="Reject"
					icon="sap-icon://delete"
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
