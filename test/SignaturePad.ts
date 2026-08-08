import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Image from "sap/m/Image";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedSignaturePad from "ui5/touch/controls/SignaturePad";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard, createText } from "./Menu";

const model = new JSONModel(
	{
		value: "",
		placeholder: "Sign here",
		height: "12rem",
		size: SizeMode.XL,
		enabled: true,
		showClearButton: true,
		valueState: "None",
		signed: false,
		length: 0,
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "SignaturePad Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Size", width: "120px" }),
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
					new Text({ text: "Height", width: "120px" }),
					new Select({
						selectedKey: "{json>/height}",
						items: [
							new Item({ key: "8rem", text: "8rem" }),
							new Item({ key: "12rem", text: "12rem" }),
							new Item({ key: "16rem", text: "16rem" }),
							new Item({ key: "24rem", text: "24rem" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Value State", width: "120px" }),
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
					new Text({ text: "Behavior", width: "120px" }),
					new CheckBox({
						text: "Enabled",
						selected: "{json>/enabled}",
					}),
					new CheckBox({
						text: "Clear button",
						selected: "{json>/showClearButton}",
					}),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Signed", width: "120px" }),
					new Text({ text: "{json>/signed}" }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Data URL", width: "120px" }),
					new Text({ text: "{json>/length} characters" }),
				],
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

const pad = new Card({
	header: new Header({
		title: "ui5.touch.controls.SignaturePad",
		subtitle: "Sign with the mouse, a finger or a stylus",
	}),
	layoutData: new FlexItemData({ growFactor: 2, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedSignaturePad({
				value: "{json>/value}",
				placeholder: "{json>/placeholder}",
				height: "{json>/height}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				showClearButton: "{json>/showClearButton}",
				valueState: "{json>/valueState}",
				change: (event) => {
					const value = event.getParameter("value") ?? "";
					model.setProperty("/signed", event.getParameter("signed"));
					model.setProperty("/length", value.length);
					model.setProperty("/preview", value);
				},
			}),
			createText(`
There is no <code>sap.m</code> equivalent. The pad draws on a canvas and hands
the result over as a PNG data URL in <code>value</code>, so it can be bound to a
model and sent to the backend like any other value. Stroke width, placeholder
and clear button follow the <code>size</code> property.
`),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const preview = new Card({
	header: new Header({
		title: "The value",
		subtitle: "The data URL rendered as an image",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new Image({
				src: "{json>/preview}",
				width: "100%",
				densityAware: false,
				visible: "{json>/signed}",
			}),
			new Text({
				text: "Nothing signed yet",
				visible: {
					path: "json>/signed",
					formatter: (signed: boolean) => !signed,
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
		items: [options, pad, preview],
	}).addStyleClass("touchControlsCardRow"),
);

page.addItem(
	createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:SignaturePad
		value="{/signature}"
		placeholder="Sign here"
		height="12rem"
		size="XL"
		change=".onSigned" />
</mvc:View>
`),
);

page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("SignaturePad", page);
