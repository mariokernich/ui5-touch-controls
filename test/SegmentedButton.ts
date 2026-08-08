import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import { FlexJustifyContent } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import SapMSegmentedButton from "sap/m/SegmentedButton";
import SapMSegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SegmentedButton from "ui5/touch/controls/SegmentedButton";
import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		size: SizeMode.L,
		enabled: true,
		width: "",
		view: "list",
		chart: "bar",
		density: "grid",
		mode: "day",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "SegmentedButton Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Size", width: "60px" }),
					new Select({
						selectedKey: "{json>/size}",
						items: [
							new Item({ key: "S", text: "S" }),
							new Item({ key: "M", text: "M" }),
							new Item({ key: "L", text: "L" }),
							new Item({ key: "XL", text: "XL" }),
							new Item({ key: "2XL", text: "2XL" }),
							new Item({ key: "3XL", text: "3XL" }),
							new Item({ key: "4XL", text: "4XL" }),
							new Item({ key: "5XL", text: "5XL" }),
							new Item({ key: "6XL", text: "6XL" }),
						],
					}),
				],
			}),
			new Text({
				text: "size only exists on the touch control — sap.m.SegmentedButton stays at its fixed height.",
			}).addStyleClass("sapUiTinyMarginTop"),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/enabled}",
						text: "Enabled",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						text: "Full width",
						select: (event: CheckBox$SelectEvent) => {
							model.setProperty(
								"/width",
								event.getParameters().selected ? "100%" : "",
							);
						},
					}),
				],
			}),
			new Text({
				text: "Both controls share the same model, so selecting a segment on one side moves the other one as well.",
			}).addStyleClass("sapUiTinyMarginTop"),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

function createGroupTitle(text: string): Title {
	return new Title({ text: text, level: "H6" })
		.addStyleClass("sapUiSmallMarginTop")
		.addStyleClass("sapUiTinyMarginBottom");
}

const sized = new Card({
	header: new Header({
		title: "ui5.touch.controls.SegmentedButton",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			createGroupTitle("Text only"),
			new SegmentedButton({
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/view}",
				items: [
					new SegmentedButtonItem({ key: "list", text: "List" }),
					new SegmentedButtonItem({ key: "grid", text: "Grid" }),
					new SegmentedButtonItem({ key: "table", text: "Table" }),
				],
				selectionChange: (event) => {
					MessageToast.show(
						`ui5.touch.controls: ${event.getParameter("key") ?? ""}`,
					);
				},
			}),

			createGroupTitle("Icon and text"),
			new SegmentedButton({
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/chart}",
				items: [
					new SegmentedButtonItem({
						key: "line",
						text: "Line",
						icon: "sap-icon://line-chart",
					}),
					new SegmentedButtonItem({
						key: "bar",
						text: "Bar",
						icon: "sap-icon://bar-chart",
					}),
					new SegmentedButtonItem({
						key: "pie",
						text: "Pie",
						icon: "sap-icon://pie-chart",
					}),
				],
			}),

			createGroupTitle("Icon only"),
			new SegmentedButton({
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/density}",
				items: [
					new SegmentedButtonItem({ key: "list", icon: "sap-icon://list" }),
					new SegmentedButtonItem({ key: "grid", icon: "sap-icon://grid" }),
					new SegmentedButtonItem({
						key: "table",
						icon: "sap-icon://table-view",
					}),
				],
			}),

			createGroupTitle("With a disabled item"),
			new SegmentedButton({
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/mode}",
				items: [
					new SegmentedButtonItem({ key: "day", text: "Day" }),
					new SegmentedButtonItem({ key: "week", text: "Week" }),
					new SegmentedButtonItem({
						key: "month",
						text: "Month",
						enabled: false,
					}),
				],
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const sapM = new Card({
	header: new Header({
		title: "sap.m.SegmentedButton",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			createGroupTitle("Text only"),
			new SapMSegmentedButton({
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/view}",
				items: [
					new SapMSegmentedButtonItem({ key: "list", text: "List" }),
					new SapMSegmentedButtonItem({ key: "grid", text: "Grid" }),
					new SapMSegmentedButtonItem({ key: "table", text: "Table" }),
				],
				selectionChange: (event) => {
					MessageToast.show(
						`sap.m: ${event.getParameter("item")?.getKey() ?? ""}`,
					);
				},
			}),

			createGroupTitle("Icon and text"),
			new SapMSegmentedButton({
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/chart}",
				items: [
					new SapMSegmentedButtonItem({
						key: "line",
						text: "Line",
						icon: "sap-icon://line-chart",
					}),
					new SapMSegmentedButtonItem({
						key: "bar",
						text: "Bar",
						icon: "sap-icon://bar-chart",
					}),
					new SapMSegmentedButtonItem({
						key: "pie",
						text: "Pie",
						icon: "sap-icon://pie-chart",
					}),
				],
			}),

			createGroupTitle("Icon only"),
			new SapMSegmentedButton({
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/density}",
				items: [
					new SapMSegmentedButtonItem({
						key: "list",
						icon: "sap-icon://list",
					}),
					new SapMSegmentedButtonItem({
						key: "grid",
						icon: "sap-icon://grid",
					}),
					new SapMSegmentedButtonItem({
						key: "table",
						icon: "sap-icon://table-view",
					}),
				],
			}),

			createGroupTitle("With a disabled item"),
			new SapMSegmentedButton({
				enabled: "{json>/enabled}",
				width: "{json>/width}",
				selectedKey: "{json>/mode}",
				items: [
					new SapMSegmentedButtonItem({ key: "day", text: "Day" }),
					new SapMSegmentedButtonItem({ key: "week", text: "Week" }),
					new SapMSegmentedButtonItem({
						key: "month",
						text: "Month",
						enabled: false,
					}),
				],
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
	<tc:SegmentedButton
		size="XL"
		selectedKey="{/view}"
		selectionChange=".onViewChange">
		<tc:SegmentedButtonItem
			key="list"
			text="List"
			icon="sap-icon://list" />
		<tc:SegmentedButtonItem
			key="grid"
			text="Grid"
			icon="sap-icon://grid" />
		<tc:SegmentedButtonItem
			key="table"
			text="Table"
			icon="sap-icon://table-view" />
	</tc:SegmentedButton>
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("SegmentedButton", page);
