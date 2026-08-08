import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import StandardRadioButton from "sap/m/RadioButton";
import StandardRadioButtonGroup from "sap/m/RadioButtonGroup";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedRadioButton from "ui5/touch/controls/RadioButton";
import SizedRadioButtonGroup from "ui5/touch/controls/RadioButtonGroup";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const shifts = ["Early shift", "Late shift", "Night shift"];

const model = new JSONModel(
	{
		selectedIndex: 1,
		columns: 1,
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
		title: "RadioButton Options",
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
					new Text({ text: "Columns", width: "100px" }),
					new StepInput({
						value: "{json>/columns}",
						min: 1,
						max: 3,
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
		title: "ui5.touch.controls.RadioButtonGroup",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedRadioButtonGroup({
				selectedIndex: "{json>/selectedIndex}",
				columns: "{json>/columns}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				buttons: shifts.map((shift) => new SizedRadioButton({ text: shift })),
				select: (event) => {
					model.setProperty(
						"/lastEvent",
						`select: selectedIndex=${event.getParameter("selectedIndex")}`,
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
		title: "sap.m.RadioButtonGroup",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new StandardRadioButtonGroup({
				selectedIndex: "{json>/selectedIndex}",
				columns: "{json>/columns}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				buttons: shifts.map(
					(shift) => new StandardRadioButton({ text: shift }),
				),
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
	xmlns:tc="ui5.touch.controls">
	<tc:RadioButtonGroup
		selectedIndex="{/shift}"
		columns="1"
		size="XL"
		select=".onShiftSelect">
		<tc:RadioButton text="Early shift" />
		<tc:RadioButton text="Late shift" />
		<tc:RadioButton text="Night shift" />
	</tc:RadioButtonGroup>
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("RadioButton", page);
