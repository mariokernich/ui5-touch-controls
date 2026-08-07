import CheckBox from "sap/m/CheckBox";
import { FlexAlignItems } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import HBox from "sap/m/HBox";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SegmentedButton from "ui5/touch/controls/SegmentedButton";
import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel({
	size: SizeMode.XL,
	view: "list",
	enabled: true,
});

const sizeSelect = new HBox({
	alignItems: FlexAlignItems.Center,
	items: [
		new Text({ text: "Size", width: "100px" }),
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
}).addStyleClass("sapUiSmallMarginBottom");

function createSectionTitle(text: string): Title {
	return new Title({ text: text })
		.addStyleClass("sapUiMediumMarginTop")
		.addStyleClass("sapUiTinyMarginBottom");
}

function createHint(text: string): Text {
	return new Text({ text: text }).addStyleClass("sapUiTinyMarginTop");
}

// text only, the selected key is bound two-way to the model
const textOnly = new SegmentedButton({
	size: "{json>/size}",
	selectedKey: "{json>/view}",
	items: [
		new SegmentedButtonItem({ key: "list", text: "List" }),
		new SegmentedButtonItem({ key: "grid", text: "Grid" }),
		new SegmentedButtonItem({ key: "table", text: "Table" }),
	],
	selectionChange: (event) => {
		MessageToast.show(`Selected key: ${event.getParameter("key") ?? ""}`);
	},
});

const iconAndText = new SegmentedButton({
	size: "{json>/size}",
	items: [
		new SegmentedButtonItem({
			key: "line",
			text: "Line",
			icon: "sap-icon://line-chart",
		}),
		new SegmentedButtonItem({
			key: "bar",
			text: "Bar",
			icon: "sap-icon://bar-chart",
		}),
		new SegmentedButtonItem({
			key: "pie",
			text: "Pie",
			icon: "sap-icon://pie-chart",
		}),
	],
});

const iconOnly = new SegmentedButton({
	size: "{json>/size}",
	selectedKey: "grid",
	items: [
		new SegmentedButtonItem({ key: "list", icon: "sap-icon://list" }),
		new SegmentedButtonItem({ key: "grid", icon: "sap-icon://grid" }),
		new SegmentedButtonItem({ key: "table", icon: "sap-icon://table-view" }),
	],
});

// an explicit width spreads the segments evenly
const fullWidth = new SegmentedButton({
	size: "{json>/size}",
	width: "100%",
	selectedKey: "email",
	items: [
		new SegmentedButtonItem({
			key: "email",
			text: "Email",
			icon: "sap-icon://email",
		}),
		new SegmentedButtonItem({
			key: "phone",
			text: "Phone",
			icon: "sap-icon://phone",
		}),
		new SegmentedButtonItem({
			key: "calendar",
			text: "Appointment",
			icon: "sap-icon://calendar",
		}),
	],
});

const withDisabledItem = new SegmentedButton({
	size: "{json>/size}",
	enabled: "{json>/enabled}",
	selectedKey: "day",
	items: [
		new SegmentedButtonItem({ key: "day", text: "Day" }),
		new SegmentedButtonItem({ key: "week", text: "Week" }),
		new SegmentedButtonItem({ key: "month", text: "Month", enabled: false }),
	],
});

const page = new VBox({
	items: [
		sizeSelect,

		createSectionTitle("Text only"),
		textOnly,
		new HBox({
			alignItems: FlexAlignItems.Center,
			items: [
				new Text({ text: "selectedKey:" }).addStyleClass("sapUiTinyMarginEnd"),
				new Text({ text: "{json>/view}" }),
			],
		}).addStyleClass("sapUiTinyMarginTop"),
		createHint(
			"The selectedKey is bound two-way — selecting a segment updates the model, and setting the model selects the segment.",
		),

		createSectionTitle("Icon and text"),
		iconAndText,

		createSectionTitle("Icon only"),
		iconOnly,

		createSectionTitle("Full width"),
		fullWidth,
		createHint(
			'Without a width every segment is as wide as its content. With width="100%" the segments share the available space evenly.',
		),

		createSectionTitle("Disabled"),
		withDisabledItem,
		new CheckBox({
			text: "Control enabled",
			selected: "{json>/enabled}",
		}),
		createHint(
			'The segment "Month" has enabled="false" on the item; the checkbox disables the whole control.',
		),

		createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<tc:SegmentedButton
		size="XL"
		selectedKey="{/view}"
		selectionChange=".onViewChange">
		<tc:SegmentedButtonItem
			key="list"
			text="List"
			icon="sap-icon://list" />
		<tc:SegmentedButtonItem
			key="grid"
			text="Grid"
			icon="sap-icon://grid" />
		<tc:SegmentedButtonItem
			key="table"
			text="Table"
			icon="sap-icon://table-view" />
	</tc:SegmentedButton>
</mvc:View>
`),
	],
}).addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("SegmentedButton", page);
