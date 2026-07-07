import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexAlignItems, FlexJustifyContent } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import VirtualKeyboard from "ui5/touch/controls/VirtualKeyboard";

const layouts: Record<string, string[]> = {
	numeric: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"],
	phone: ["1 2 3", "4 5 6", "7 8 9", "* 0 #", "{bksp} {enter}"],
	calculator: ["7 8 9 /", "4 5 6 *", "1 2 3 -", "0 . = +", "{bksp} {enter}"],
};

const model = new JSONModel(
	{
		value: "",
		layout: "numeric",
		size: "XL",
		buttonType: "Default",
		enabled: true,
		width: "400px",
		theme: "sap_horizon",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "VirtualKeyboard Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Value", width: "100px" }),
					new Input({
						value: "{json>/value}",
						valueLiveUpdate: true,
						width: "150px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Layout", width: "100px" }),
					new Select({
						selectedKey: "{json>/layout}",
						items: [
							new Item({ key: "numeric", text: "Numeric" }),
							new Item({ key: "phone", text: "Phone" }),
							new Item({ key: "calculator", text: "Calculator" }),
						],
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
					new Text({ text: "Width", width: "100px" }),
					new Input({
						value: "{json>/width}",
						placeholder: "e.g. 20rem",
						valueLiveUpdate: true,
						width: "150px",
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

const keyboard = new VirtualKeyboard({
	value: "{json>/value}",
	size: "{json>/size}",
	buttonType: "{json>/buttonType}",
	enabled: "{json>/enabled}",
	width: "{json>/width}",
	change: (event) => {
		const value = event.getParameter("value");
		model.setProperty("/value", value);
	},
	enter: (event) => {
		MessageToast.show(`Enter pressed: ${event.getParameter("value")}`);
	},
});

model.attachPropertyChange(() => {
	keyboard.setLayout(layouts[model.getProperty("/layout") as string]);
});
keyboard.setLayout(layouts[model.getProperty("/layout") as string]);

const sample = new Card({
	header: new Header({
		title: "ui5.touch.controls.VirtualKeyboard",
	}),
	layoutData: new FlexItemData({ growFactor: 2, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [keyboard],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

page.addItem(
	new HBox({
		width: "100%",
		items: [options, sample],
	}).addStyleClass("touchControlsCardRow"),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

page.placeAt("content");
