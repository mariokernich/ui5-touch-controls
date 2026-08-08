import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import StandardTimePicker from "sap/m/TimePicker";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedTimePicker from "ui5/touch/controls/TimePicker";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		value: "07:30",
		displayFormat: "HH:mm",
		minutesStep: 5,
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
		title: "TimePicker Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Size", width: "110px" }),
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
					new Text({ text: "Display format", width: "110px" }),
					new Select({
						selectedKey: "{json>/displayFormat}",
						items: [
							new Item({ key: "HH:mm", text: "HH:mm" }),
							new Item({ key: "hh:mm a", text: "hh:mm a" }),
							new Item({ key: "short", text: "short" }),
							new Item({ key: "medium", text: "medium" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Minutes step", width: "110px" }),
					new StepInput({
						value: "{json>/minutesStep}",
						min: 1,
						max: 30,
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Value State", width: "110px" }),
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
					new Text({ text: "Behavior", width: "110px" }),
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
					new Text({ text: "Value", width: "110px" }),
					new Text({ text: "{json>/value}" }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Last event", width: "110px" }),
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
		title: "ui5.touch.controls.TimePicker",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedTimePicker({
				value: "{json>/value}",
				displayFormat: "{json>/displayFormat}",
				minutesStep: "{json>/minutesStep}",
				placeholder: "Pick a time...",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "14rem",
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: value="${event.getParameter("value")}", valid=${event.getParameter("valid")}`,
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
		title: "sap.m.TimePicker",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new StandardTimePicker({
				value: "{json>/value}",
				valueFormat: "HH:mm",
				displayFormat: "{json>/displayFormat}",
				minutesStep: "{json>/minutesStep}",
				placeholder: "Pick a time...",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "14rem",
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
	<tc:TimePicker
		value="{/shiftStart}"
		valueFormat="HH:mm"
		displayFormat="HH:mm"
		minutesStep="5"
		size="XL"
		width="14rem"
		change=".onShiftStartChange" />
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("TimePicker", page);
