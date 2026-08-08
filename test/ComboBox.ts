import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import ComboBox from "sap/m/ComboBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedComboBox from "ui5/touch/controls/ComboBox";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

/** the items both combo boxes are filled from */
const materials = [
	{ key: "M-1001", text: "Aluminium sheet 2 mm" },
	{ key: "M-1002", text: "Aluminium sheet 4 mm" },
	{ key: "M-2001", text: "Steel bar 10 mm" },
	{ key: "M-2002", text: "Steel bar 20 mm" },
	{ key: "M-3001", text: "Copper wire 1.5 mm²" },
	{ key: "M-3002", text: "Copper wire 2.5 mm²" },
];

const model = new JSONModel(
	{
		materials: materials,
		value: "Steel bar 10 mm",
		selectedKey: "M-2001",
		size: SizeMode.L,
		enabled: true,
		editable: true,
		valueState: "None",
		lastEvent: "-",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "ComboBox Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Size", width: "100px" }),
					new Select({
						selectedKey: "{json>/size}",
						items: Object.values(SizeMode).map(
							(size) => new Item({ key: size, text: size }),
						),
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Value State", width: "100px" }),
					new Select({
						selectedKey: "{json>/valueState}",
						items: [
							new Item({ key: "None", text: "None" }),
							new Item({ key: "Error", text: "Error" }),
							new Item({ key: "Warning", text: "Warning" }),
							new Item({ key: "Success", text: "Success" }),
							new Item({ key: "Information", text: "Information" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Behavior", width: "100px" }),
					new CheckBox({
						text: "Enabled",
						selected: "{json>/enabled}",
					}),
					new CheckBox({
						text: "Editable",
						selected: "{json>/editable}",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Value", width: "100px" }),
					new Text({ text: "{json>/value}" }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Selected key", width: "100px" }),
					new Text({ text: "{json>/selectedKey}" }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Last event", width: "100px" }),
					new Text({ text: "{json>/lastEvent}" }),
				],
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

const sized = new Card({
	header: new Header({
		title: "ui5.touch.controls.ComboBox",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedComboBox({
				value: "{json>/value}",
				selectedKey: "{json>/selectedKey}",
				placeholder: "Search material...",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "22rem",
				items: {
					path: "json>/materials",
					template: new Item({
						key: "{json>key}",
						text: "{json>text}",
					}),
				},
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: value="${event.getParameter("value")}", selectedKey=${event.getParameter("selectedKey") || "(none)"}`,
					);
				},
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const sapM = new Card({
	header: new Header({
		title: "sap.m.ComboBox",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new ComboBox({
				value: "{json>/value}",
				selectedKey: "{json>/selectedKey}",
				placeholder: "Search material...",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "22rem",
				items: {
					path: "json>/materials",
					template: new Item({
						key: "{json>key}",
						text: "{json>text}",
					}),
				},
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

page.addItem(
	new HBox({
		width: "100%",
		items: [options, sized, sapM],
	}).addStyleClass("touchControlsCardRow"),
);

page.addItem(
	createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:core="sap.ui.core"
	xmlns:tc="ui5.touch.controls">
	<tc:ComboBox
		value="{/material}"
		selectedKey="{/materialKey}"
		placeholder="Search material..."
		size="XL"
		width="22rem"
		change=".onMaterialChange">
		<core:Item key="M-1001" text="Aluminium sheet 2 mm" />
		<core:Item key="M-2001" text="Steel bar 10 mm" />
		<core:Item key="M-3001" text="Copper wire 1.5 mm²" />
	</tc:ComboBox>
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("ComboBox", page);
