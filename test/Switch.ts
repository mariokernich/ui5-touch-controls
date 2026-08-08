import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import StandardSwitch from "sap/m/Switch";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedSwitch from "ui5/touch/controls/Switch";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		state: true,
		customTextOn: "",
		customTextOff: "",
		type: "Default",
		size: SizeMode.L,
		enabled: true,
		lastEvent: "-",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "Switch Options",
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
					new Text({ text: "Type", width: "110px" }),
					new Select({
						selectedKey: "{json>/type}",
						items: [
							new Item({ key: "Default", text: "Default" }),
							new Item({ key: "AcceptReject", text: "AcceptReject" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Text on", width: "110px" }),
					new Input({
						value: "{json>/customTextOn}",
						placeholder: "ON",
						valueLiveUpdate: true,
						width: "150px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Text off", width: "110px" }),
					new Input({
						value: "{json>/customTextOff}",
						placeholder: "OFF",
						valueLiveUpdate: true,
						width: "150px",
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
						text: "State",
						selected: "{json>/state}",
					}),
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
		title: "ui5.touch.controls.Switch",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedSwitch({
				state: "{json>/state}",
				customTextOn: "{json>/customTextOn}",
				customTextOff: "{json>/customTextOff}",
				type: "{json>/type}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: state=${event.getParameter("state")}`,
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
		title: "sap.m.Switch",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new StandardSwitch({
				state: "{json>/state}",
				customTextOn: "{json>/customTextOn}",
				customTextOff: "{json>/customTextOff}",
				type: "{json>/type}",
				enabled: "{json>/enabled}",
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
	<tc:Switch
		state="{/maintenanceMode}"
		size="XL"
		change=".onMaintenanceModeChange" />
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Switch", page);
