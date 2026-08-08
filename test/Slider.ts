import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import StandardRangeSlider from "sap/m/RangeSlider";
import Select from "sap/m/Select";
import StandardSlider from "sap/m/Slider";
import StepInput from "sap/m/StepInput";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedRangeSlider from "ui5/touch/controls/RangeSlider";
import SizedSlider from "ui5/touch/controls/Slider";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		value: 40,
		rangeStart: 20,
		rangeEnd: 70,
		min: 0,
		max: 100,
		step: 5,
		showTooltip: true,
		enableTickmarks: true,
		size: SizeMode.L,
		enabled: true,
		lastEvent: "-",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "Slider Options",
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
					new Text({ text: "Min / Max", width: "110px" }),
					new StepInput({ value: "{json>/min}", min: -100, max: 0, step: 10 }),
					new StepInput({ value: "{json>/max}", min: 10, max: 1000, step: 10 }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Step", width: "110px" }),
					new StepInput({ value: "{json>/step}", min: 1, max: 25 }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Appearance", width: "110px" }),
					new CheckBox({ text: "Tooltip", selected: "{json>/showTooltip}" }),
					new CheckBox({
						text: "Tickmarks",
						selected: "{json>/enableTickmarks}",
					}),
					new CheckBox({ text: "Enabled", selected: "{json>/enabled}" }),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Values", width: "110px" }),
					new Text({
						text: "{json>/value} · {json>/rangeStart}–{json>/rangeEnd}",
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
		title: "ui5.touch.controls.Slider / RangeSlider",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		width: "100%",
		items: [
			new SizedSlider({
				value: "{json>/value}",
				min: "{json>/min}",
				max: "{json>/max}",
				step: "{json>/step}",
				showTooltip: "{json>/showTooltip}",
				enableTickmarks: "{json>/enableTickmarks}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: value=${event.getParameter("value")}`,
					);
				},
			}),
			new SizedRangeSlider({
				value: "{json>/rangeStart}",
				value2: "{json>/rangeEnd}",
				min: "{json>/min}",
				max: "{json>/max}",
				step: "{json>/step}",
				showTooltip: "{json>/showTooltip}",
				enableTickmarks: "{json>/enableTickmarks}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				change: (event) => {
					model.setProperty(
						"/lastEvent",
						`change: range=${event.getParameter("value")}–${event.getParameter("value2")}`,
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
		title: "sap.m.Slider / RangeSlider",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		width: "100%",
		items: [
			new StandardSlider({
				value: "{json>/value}",
				min: "{json>/min}",
				max: "{json>/max}",
				step: "{json>/step}",
				enableTickmarks: "{json>/enableTickmarks}",
				enabled: "{json>/enabled}",
				width: "100%",
			}),
			new StandardRangeSlider({
				range: [20, 70],
				min: "{json>/min}",
				max: "{json>/max}",
				step: "{json>/step}",
				enableTickmarks: "{json>/enableTickmarks}",
				enabled: "{json>/enabled}",
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

page.addItem(
	createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Slider
		value="{/quantity}"
		min="0"
		max="100"
		step="5"
		size="XL"
		enableTickmarks="true"
		change=".onQuantityChange" />
	<tc:RangeSlider
		value="{/from}"
		value2="{/to}"
		min="0"
		max="100"
		step="5"
		size="XL"
		change=".onRangeChange" />
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Slider", page);
