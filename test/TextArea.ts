import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexAlignItems, FlexJustifyContent } from "sap/m/library";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedTextArea from "ui5/touch/controls/TextArea";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage from "./Menu";

const model = new JSONModel(
	{
		value: "Hello World\nThis is a multi-line text.",
		placeholder: "Enter text...",
		rows: 4,
		maxLength: 0,
		size: SizeMode.M,
		enabled: true,
		editable: true,
		valueState: "None",
		theme: "sap_horizon",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "TextArea Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Placeholder", width: "100px" }),
					new Input({
						value: "{json>/placeholder}",
						placeholder: "Placeholder",
						valueLiveUpdate: true,
						width: "300px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Rows", width: "100px" }),
					new StepInput({
						value: "{json>/rows}",
						min: 1,
						max: 20,
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Max Length", width: "100px" }),
					new StepInput({
						value: "{json>/maxLength}",
						min: 0,
						max: 500,
						step: 10,
					}),
				],
			}),
			new HBox({
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
							new Item({ key: "XXL", text: "XXL" }),
							new Item({ key: "XXXL", text: "XXXL" }),
						],
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
					new Text({ text: "Theme", width: "100px" }),
					new Select({
						selectedKey: "{json>/theme}",
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
		title: "ui5.touch.controls.TextArea",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new SizedTextArea({
				value: "{json>/value}",
				placeholder: "{json>/placeholder}",
				rows: "{json>/rows}",
				maxLength: "{json>/maxLength}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "100%",
				liveChange: (event) => {
					model.setProperty("/value", event.getParameter("value"));
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
		title: "sap.m.TextArea",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new TextArea({
				value: "{json>/value}",
				placeholder: "{json>/placeholder}",
				rows: "{json>/rows}",
				maxLength: "{json>/maxLength}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				valueLiveUpdate: true,
				width: "100%",
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
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("TextArea", page);
