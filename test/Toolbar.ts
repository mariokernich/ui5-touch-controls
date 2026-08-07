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
import initTestPage, { createExampleCard } from "./Menu";
import Dialog from "sap/m/Dialog";
import Page from "sap/m/Page";
import MessageToast from "sap/m/MessageToast";

const model = new JSONModel({
	size: SizeMode.XL,
});

const select = new Select({
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
});

const sizeSelect = new HBox({
	alignItems: FlexAlignItems.Center,
	items: [new Text({ text: "Button size", width: "100px" }), select],
}).addStyleClass("sapUiSmallMarginBottom");

const toolbar = new Toolbar({
	content: [
		new SizedButton({
			text: "Open Sample Dialog",
			type: ButtonType.Emphasized,
			icon: "sap-icon://add",
			size: "{json>/size}",
			press: () => {
				const dialog = new Dialog({
					title: "Sample Dialog",
					contentWidth: "700px",
					contentHeight: "250px",
				});
				dialog.addContent(
					new VBox({
						alignItems: FlexAlignItems.Center,
						justifyContent: "Center",
						height: "100%",
						items: [new Text({ text: "Change Button Size" }), select],
					}),
				);
				dialog.setFooter(
					new Toolbar({
						content: [
							new SizedButton({
								text: "Close Dialog",
								type: ButtonType.Emphasized,
								size: "{json>/size}",
								icon: "sap-icon://decline",
								press: () => dialog.close(),
							}),
							new ToolbarSpacer(),
							new SizedButton({
								text: "Dummy",
								type: ButtonType.Ghost,
								size: "{json>/size}",
								icon: "sap-icon://edit",
								press: () => {
									MessageToast.show("Dummy button pressed");
								},
							}),
						],
					}),
				);
				dialog.setModel(model, "json");
				dialog.open();
			},
		}),
		new SizedButton({
			text: "Button 2",
			type: ButtonType.Ghost,
			icon: "sap-icon://edit",
			size: "{json>/size}",
			press: () => {
				MessageToast.show("Dummy button pressed");
			},
		}),
		new ToolbarSpacer(),
		new SizedButton({
			text: "Button 3",
			type: ButtonType.Reject,
			icon: "sap-icon://delete",
			size: "{json>/size}",
			press: () => {
				MessageToast.show("Dummy button pressed");
			},
		}),
	],
});

// live example: a sap.m.Page with the touch Toolbar as content
// and an OverflowToolbar as footer — the Page needs an explicit
// height, otherwise it collapses inside the VBox
const style = document.createElement("style");
style.textContent = ".toolbarDemoPage { height: 20rem; }";
document.head.appendChild(style);

const demoPage = new Page({
	title: "Page with footer",
	showFooter: true,
	content: [toolbar],
	footer: toolbar,
}).addStyleClass("toolbarDemoPage");

const page = new VBox({
	items: [
		sizeSelect,
		demoPage,
		createExampleCard(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls.touch">
	<Page showFooter="true">
		<footer>
			<tc:Toolbar>
				<Button
					text="Add"
					type="Emphasized"
					icon="sap-icon://add"
					press=".onAdd" />
				<ToolbarSpacer />
				<Button
					text="Delete"
					type="Reject"
					icon="sap-icon://delete"
					press=".onDelete" />
			</tc:Toolbar>
		</footer>
	</Page>
</mvc:View>
`),
	],
}).addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("Toolbar", page);
