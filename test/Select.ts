import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedSelect from "ui5/touch/controls/Select";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

/** the items both selects are filled from */
const workstations = [
	{ key: "A1", text: "Assembly line 1" },
	{ key: "A2", text: "Assembly line 2" },
	{ key: "P1", text: "Packaging" },
	{ key: "Q1", text: "Quality gate" },
	{ key: "S1", text: "Shipping" },
];

const model = new JSONModel(
	{
		workstations: workstations,
		selectedKey: "P1",
		size: SizeMode.M,
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
		title: "Select Options",
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
		title: "ui5.touch.controls.Select",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedSelect({
				selectedKey: "{json>/selectedKey}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "20rem",
				items: {
					path: "json>/workstations",
					template: new Item({
						key: "{json>key}",
						text: "{json>text}",
					}),
				},
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: selectedKey=${event.getParameter("selectedKey")}`,
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
		title: "sap.m.Select",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new Select({
				selectedKey: "{json>/selectedKey}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "20rem",
				items: {
					path: "json>/workstations",
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

const sizes = new Card({
	header: new Header({
		title: "All sizes",
		subtitle: "The field and the rows of the list scale together",
	}),
	content: new VBox({
		items: Object.values(SizeMode).map(
			(size) =>
				new SizedSelect({
					size: size,
					selectedKey: "P1",
					width: "20rem",
					items: workstations.map(
						(workstation) =>
							new Item({ key: workstation.key, text: workstation.text }),
					),
				}),
		),
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

page.addItem(sizes);

page.addItem(
	createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:core="sap.ui.core"
	xmlns:tc="ui5.touch.controls">
	<tc:Select
		selectedKey="{/workstation}"
		size="XL"
		width="20rem"
		change=".onWorkstationChange">
		<core:Item key="A1" text="Assembly line 1" />
		<core:Item key="P1" text="Packaging" />
		<core:Item key="S1" text="Shipping" />
	</tc:Select>
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Select", page);
