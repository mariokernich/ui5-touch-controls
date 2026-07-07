import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexAlignItems, FlexJustifyContent } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import QuantityPicker from "ui5/touch/controls/QuantityPicker";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage from "./Menu";

const model = new JSONModel(
	{
		value: 1,
		min: 0,
		max: 10,
		size: SizeMode.M,
		buttonType: "Default",
		enabled: true,
		editable: true,
		theme: "sap_horizon",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "QuantityPicker Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Min", width: "100px" }),
					new Input({
						value: "{json>/min}",
						type: "Number",
						valueLiveUpdate: true,
						width: "100px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Max", width: "100px" }),
					new Input({
						value: "{json>/max}",
						type: "Number",
						valueLiveUpdate: true,
						width: "100px",
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
					new Text({ text: "Button Type", width: "100px" }),
					new Select({
						selectedKey: "{json>/buttonType}",
						items: [
							new Item({ key: "Default", text: "Default" }),
							new Item({ key: "Emphasized", text: "Emphasized" }),
							new Item({ key: "Accept", text: "Accept" }),
							new Item({ key: "Reject", text: "Reject" }),
							new Item({ key: "Attention", text: "Attention" }),
							new Item({ key: "Transparent", text: "Transparent" }),
							new Item({ key: "Neutral", text: "Neutral" }),
							new Item({ key: "Critical", text: "Critical" }),
							new Item({ key: "Negative", text: "Negative" }),
							new Item({ key: "Success", text: "Success" }),
							new Item({ key: "Ghost", text: "Ghost" }),
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
		title: "ui5.touch.controls.QuantityPicker",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new QuantityPicker({
				value: "{json>/value}",
				min: "{json>/min}",
				max: "{json>/max}",
				size: "{json>/size}",
				buttonType: "{json>/buttonType}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				change: (event) => {
					const value = event.getParameter("value");
					model.setProperty("/value", value);
					MessageToast.show(`Quantity changed: ${value}`);
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
		title: "sap.m.StepInput",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new StepInput({
				value: "{json>/value}",
				min: "{json>/min}",
				max: "{json>/max}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				width: "10rem",
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

initTestPage("QuantityPicker", page);
