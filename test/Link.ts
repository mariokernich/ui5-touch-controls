import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexJustifyContent } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import SapMLink from "sap/m/Link";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import Link from "ui5/touch/controls/Link";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, { createExampleCard } from "./Menu";

const REPO = "https://github.com/mariokernich/ui5-touch-controls";
const LONG_TEXT =
	"A rather long link text that does not fit into the available width";

const model = new JSONModel(
	{
		size: SizeMode.L,
		text: "Open the repository",
		enabled: true,
		wrapping: false,
		subtle: false,
		emphasized: false,
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({ title: "Link Options" }),
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
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Text", width: "60px" }),
					new Input({
						value: "{json>/text}",
						valueLiveUpdate: true,
						width: "260px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [new CheckBox({ selected: "{json>/enabled}", text: "Enabled" })],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({ selected: "{json>/wrapping}", text: "Wrapping" }),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [new CheckBox({ selected: "{json>/subtle}", text: "Subtle" })],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({ selected: "{json>/emphasized}", text: "Emphasized" }),
				],
			}),
			new Text({
				text: "size only exists on the touch control — sap.m.Link stays at its fixed font size.",
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
	header: new Header({ title: "ui5.touch.controls.Link" }),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			createGroupTitle("With a press handler"),
			new Link({
				text: "{json>/text}",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
				subtle: "{json>/subtle}",
				emphasized: "{json>/emphasized}",
				press: () => {
					MessageToast.show("ui5.touch.controls.Link pressed");
				},
			}),

			createGroupTitle("With a href, opening a new tab"),
			new Link({
				text: "{json>/text}",
				href: REPO,
				target: "_blank",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
				subtle: "{json>/subtle}",
				emphasized: "{json>/emphasized}",
			}),

			createGroupTitle("Truncated at a fixed width"),
			new Link({
				text: LONG_TEXT,
				href: REPO,
				width: "240px",
				size: "{json>/size}",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
			}),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
});

const sapM = new Card({
	header: new Header({ title: "sap.m.Link" }),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			createGroupTitle("With a press handler"),
			new SapMLink({
				text: "{json>/text}",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
				subtle: "{json>/subtle}",
				emphasized: "{json>/emphasized}",
				press: () => {
					MessageToast.show("sap.m.Link pressed");
				},
			}),

			createGroupTitle("With a href, opening a new tab"),
			new SapMLink({
				text: "{json>/text}",
				href: REPO,
				target: "_blank",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
				subtle: "{json>/subtle}",
				emphasized: "{json>/emphasized}",
			}),

			createGroupTitle("Truncated at a fixed width"),
			new SapMLink({
				text: LONG_TEXT,
				href: REPO,
				width: "240px",
				enabled: "{json>/enabled}",
				wrapping: "{json>/wrapping}",
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
	<tc:Link
		text="Open the documentation"
		href="https://openui5.org"
		target="_blank"
		size="XL" />
	<tc:Link
		text="Show details"
		size="XL"
		emphasized="true"
		press=".onShowDetails" />
</mvc:View>
`),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Link", page);
