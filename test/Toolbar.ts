import { ButtonType, FlexAlignItems } from "sap/m/library";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import HBox from "sap/m/HBox";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import Toolbar from "ui5/touch/controls/Toolbar";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Button from "sap/m/Button";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel({
	size: SizeMode.XL,
});

const sizeSelect = new HBox({
	alignItems: FlexAlignItems.Center,
	items: [
		new Text({ text: "Button size", width: "100px" }),
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
}).addStyleClass("sapUiSmallMarginBottom");

const toolbar = new Toolbar({
	content: [
		new SizedButton({
			text: "Button 1",
			type: ButtonType.Emphasized,
			icon: "sap-icon://add",
			size: "{json>/size}",
		}),
		new SizedButton({
			text: "Button 2",
			type: ButtonType.Ghost,
			icon: "sap-icon://edit",
			size: "{json>/size}",
		}),
		new ToolbarSpacer(),
		new SizedButton({
			text: "Button 3",
			type: ButtonType.Reject,
			icon: "sap-icon://delete",
			size: "{json>/size}",
		}),
	],
});

const overflowToolbar = new OverflowToolbar({
	content: [
		new Button({
			text: "Overflow Button 1",
			type: ButtonType.Emphasized,
			icon: "sap-icon://add",
		}),
		new Button({
			text: "Overflow Button 1",
			type: ButtonType.Ghost,
			icon: "sap-icon://edit",
		}),
		new ToolbarSpacer(),
		new Button({
			text: "Overflow Button 2",
			type: ButtonType.Reject,
			icon: "sap-icon://delete",
		}),
	],
}).addStyleClass("sapUiLargeMarginTop");

const page = new VBox({
	items: [
		sizeSelect,
		toolbar,
		overflowToolbar,
		createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:m="sap.m"
	xmlns:tc="ui5.touch.controls">
	<tc:Toolbar>
		<tc:Button
			text="Add"
			type="Emphasized"
			icon="sap-icon://add"
			size="XL"
			press=".onAdd" />
		<m:ToolbarSpacer />
		<tc:Button
			text="Delete"
			type="Reject"
			icon="sap-icon://delete"
			size="XL"
			press=".onDelete" />
	</tc:Toolbar>
</mvc:View>
`),
	],
}).addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Toolbar", page);
