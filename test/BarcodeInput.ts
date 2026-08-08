import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import { FlexAlignItems } from "sap/m/library";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Table from "sap/m/Table";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedBarcodeInput from "ui5/touch/controls/BarcodeInput";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard, createText } from "./Menu";

const model = new JSONModel(
	{
		value: "",
		scanTimeout: 40,
		minLength: 3,
		prefix: "",
		suffix: "",
		clearOnScan: true,
		size: SizeMode.XL,
		enabled: true,
		editable: true,
		valueState: "None",
		log: [] as { kind: string; value: string; time: string }[],
	},
	true,
);

function log(kind: string, value: string): void {
	const entries = model.getProperty("/log") as {
		kind: string;
		value: string;
		time: string;
	}[];
	entries.unshift({
		kind: kind,
		value: value,
		time: new Date().toLocaleTimeString(),
	});
	model.setProperty("/log", entries.slice(0, 12));
}

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "BarcodeInput Options",
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
					new Text({ text: "Scan timeout", width: "120px" }),
					new StepInput({
						value: "{json>/scanTimeout}",
						min: 5,
						max: 500,
						step: 5,
					}),
					new Text({ text: "ms" }).addStyleClass("sapUiTinyMarginBegin"),
				],
			}),
			new HBox({
				alignItems: FlexAlignItems.Center,
				items: [
					new Text({ text: "Min length", width: "120px" }),
					new StepInput({
						value: "{json>/minLength}",
						min: 1,
						max: 30,
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
						text: "Editable",
						selected: "{json>/editable}",
					}),
					new CheckBox({
						text: "Clear on scan",
						selected: "{json>/clearOnScan}",
					}),
				],
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

const field = new Card({
	header: new Header({
		title: "ui5.touch.controls.BarcodeInput",
		subtitle: "Scan a code, or type one and press Enter",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new SizedBarcodeInput({
				value: "{json>/value}",
				placeholder: "Scan or type a code...",
				scanTimeout: "{json>/scanTimeout}",
				minLength: "{json>/minLength}",
				clearOnScan: "{json>/clearOnScan}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				editable: "{json>/editable}",
				valueState: "{json>/valueState}",
				width: "100%",
				scan: (event) => {
					log("scan", event.getParameter("value") ?? "");
				},
				change: (event) => {
					log("change", event.getParameter("value") ?? "");
				},
			}),
			createText(`
There is no <code>sap.m</code> equivalent: a barcode scanner in keyboard wedge
mode types the code into the focused field within a few milliseconds and closes
it with <kbd>Enter</kbd>. The control measures the time between the keystrokes,
so a scan fires <code>scan</code> while typing the same characters by hand fires
<code>change</code>.
`),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const events = new Card({
	header: new Header({
		title: "Events",
		subtitle: "The most recent one first",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new Table({
				columns: [
					new Column({
						header: new Label({ text: "Event" }),
						width: "7rem",
					}),
					new Column({ header: new Label({ text: "Value" }) }),
					new Column({
						header: new Label({ text: "Time" }),
						width: "8rem",
					}),
				],
				items: {
					path: "json>/log",
					template: new ColumnListItem({
						cells: [
							new Text({ text: "{json>kind}" }),
							new Text({ text: "{json>value}" }),
							new Text({ text: "{json>time}" }),
						],
					}),
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
		items: [options, field, events],
	}).addStyleClass("touchControlsCardRow"),
);

page.addItem(
	createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:BarcodeInput
		value="{/code}"
		placeholder="Scan a pallet..."
		size="XL"
		width="24rem"
		prefix=""
		suffix=""
		clearOnScan="true"
		scan=".onScan"
		change=".onManualEntry" />
</mvc:View>
`),
);

page.addItem(
	createExampleCard(
		`
onScan(event: BarcodeInput$ScanEvent): void {
	const code = event.getParameter("value");

	// a scan is a complete code, so it can go straight to the backend
	this.getModel().callFunction("/bookPallet", { urlParameters: { code } });
}

onManualEntry(event: BarcodeInput$ChangeEvent): void {
	// typed by hand - worth a confirmation before it is booked
	QuickDialog.confirm({ text: \`Book \${event.getParameter("value")}?\`, size: SizeMode.XL });
}
`,
		"typescript",
		"Controller Code",
	),
);

page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("BarcodeInput", page);
