import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import StandardDatePicker from "sap/m/DatePicker";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedDatePicker from "ui5/touch/controls/DatePicker";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		value: "2026-08-14",
		displayFormat: "medium",
		size: SizeMode.M,
		enabled: true,
		editable: true,
		limited: false,
		valueState: "None",
		lastEvent: "-",
	},
	true,
);

/** a range of +/- 10 days around today, to try minDate / maxDate */
const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "DatePicker Options",
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
							new Item({ key: "short", text: "short" }),
							new Item({ key: "medium", text: "medium" }),
							new Item({ key: "long", text: "long" }),
							new Item({ key: "full", text: "full" }),
							new Item({ key: "dd.MM.yyyy", text: "dd.MM.yyyy" }),
							new Item({ key: "yyyy-MM-dd", text: "yyyy-MM-dd" }),
						],
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
					new CheckBox({
						text: "Today ± 10 days only",
						selected: "{json>/limited}",
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

const sizedPicker = new SizedDatePicker({
	value: "{json>/value}",
	displayFormat: "{json>/displayFormat}",
	placeholder: "Pick a date...",
	size: "{json>/size}",
	enabled: "{json>/enabled}",
	editable: "{json>/editable}",
	valueState: "{json>/valueState}",
	width: "18rem",
	change: (event) => {
		model.setProperty(
			"/lastEvent",
			`change: value="${event.getParameter("value")}", valid=${event.getParameter("valid")}`,
		);
	},
});

const sapMPicker = new StandardDatePicker({
	value: "{json>/value}",
	valueFormat: "yyyy-MM-dd",
	displayFormat: "{json>/displayFormat}",
	placeholder: "Pick a date...",
	enabled: "{json>/enabled}",
	editable: "{json>/editable}",
	valueState: "{json>/valueState}",
	width: "18rem",
});

// the limits are plain Date objects, so they are switched from the controller
// instead of through a binding
model.attachPropertyChange(() => {
	const limited = model.getProperty("/limited") as boolean;
	sizedPicker.setMinDate(limited ? minDate : null);
	sizedPicker.setMaxDate(limited ? maxDate : null);
	// the typed setter of sap.m does not take null, but the property does
	sapMPicker.setProperty("minDate", limited ? minDate : null);
	sapMPicker.setProperty("maxDate", limited ? maxDate : null);
});

const sized = new Card({
	header: new Header({
		title: "ui5.touch.controls.DatePicker",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [sizedPicker],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const sapM = new Card({
	header: new Header({
		title: "sap.m.DatePicker",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [sapMPicker],
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
		subtitle: "The field and the days of the calendar scale together",
	}),
	content: new VBox({
		items: Object.values(SizeMode).map(
			(size) =>
				new SizedDatePicker({
					size: size,
					value: "2026-08-14",
					width: "18rem",
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
	xmlns:tc="ui5.touch.controls">
	<tc:DatePicker
		value="{/deliveryDate}"
		valueFormat="yyyy-MM-dd"
		displayFormat="medium"
		size="XL"
		width="18rem"
		change=".onDeliveryDateChange" />
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("DatePicker", page);
