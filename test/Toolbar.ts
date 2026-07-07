import { ButtonType } from "sap/m/library";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import Toolbar from "ui5/touch/controls/Toolbar";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Button from "sap/m/Button";
import initTestPage, { createExampleCard } from "./Menu";

const toolbar = new Toolbar({
	content: [
		new SizedButton({
			text: "Button 1",
			type: ButtonType.Emphasized,
			icon: "sap-icon://add",
			size: SizeMode.XL,
		}),
		new SizedButton({
			text: "Button 2",
			type: ButtonType.Ghost,
			icon: "sap-icon://edit",
			size: SizeMode.XL,
		}),
		new ToolbarSpacer(),
		new SizedButton({
			text: "Button 3",
			type: ButtonType.Reject,
			icon: "sap-icon://delete",
			size: SizeMode.XL,
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

initTestPage("Toolbar", page);
