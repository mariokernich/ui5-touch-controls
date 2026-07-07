import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import Button from "sap/m/Button";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import {
	FlexAlignItems,
	FlexJustifyContent,
	PlacementType,
} from "sap/m/library";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import ColorPicker from "sap/ui/unified/ColorPicker";
import { ColorPickerMode } from "sap/ui/unified/library";
import SizedText from "ui5/touch/controls/Text";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage from "./Menu";

const model = new JSONModel(
	{
		text: "The quick brown fox jumps over the lazy dog",
		color: "#333333",
		size: SizeMode.M,
	},
	true,
);

const page = new VBox();

const colorPicker = new ColorPicker({
	colorString: "{json>/color}",
	mode: ColorPickerMode.HSL,
	change: (event) => {
		model.setProperty("/color", event.getParameter("hex"));
	},
});

const colorPickerPopover = new ResponsivePopover({
	title: "Pick a Color",
	placement: PlacementType.Bottom,
	content: [colorPicker],
});

const options = new Card({
	header: new Header({
		title: "Text Options",
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
					new Text({ text: "Text", width: "100px" }),
					new Input({
						value: "{json>/text}",
						placeholder: "Text",
						valueLiveUpdate: true,
						width: "300px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Color", width: "100px" }),
					new Input({
						value: "{json>/color}",
						placeholder: "e.g. #333333 or red",
						valueLiveUpdate: true,
						width: "200px",
					}),
					new Button({
						icon: "sap-icon://color-fill",
						tooltip: "Choose Color",
						press: (event) => {
							colorPickerPopover.openBy(event.getSource());
						},
					}).addStyleClass("sapUiTinyMarginBegin"),
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
		title: "ui5.touch.controls.Text",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new SizedText({
				text: "{json>/text}",
				color: "{json>/color}",
				size: "{json>/size}",
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const sapM = new Card({
	header: new Header({
		title: "sap.m.Text",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new Text({
				text: "{json>/text}",
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

initTestPage("Text", page);
