import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import Button from "sap/m/Button";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { ButtonType, FlexJustifyContent } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage from "./Menu";

const model = new JSONModel(
	{
		showIcon: true,
		icon: "sap-icon://accounting-document-verification",
		showText: true,
		text: "Button",
		iconFirst: true,
		enabled: true,
		size: SizeMode.M,
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "Button Options",
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
							new Item({ key: "XXL", text: "XXL" }),
							new Item({ key: "XXXL", text: "XXXL" }),
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
						placeholder: "Button Text",
						valueLiveUpdate: true,
						width: "200px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Icon", width: "60px" }),
					new Input({
						value: "{json>/icon}",
						placeholder: "Button Icon",
						valueLiveUpdate: true,
						width: "300px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/showIcon}",
						text: "Show Icon",
						select: (event: CheckBox$SelectEvent) => {
							const selected = event.getParameters().selected;
							if (selected) {
								model.setProperty(
									"/icon",
									"sap-icon://accounting-document-verification",
								);
							} else {
								model.setProperty("/icon", "");
							}
						},
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/showText}",
						text: "Show Text",
						select: (event: CheckBox$SelectEvent) => {
							const selected = event.getParameters().selected;
							if (selected) {
								model.setProperty("/text", "Button");
							} else {
								model.setProperty("/text", "");
							}
						},
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/iconFirst}",
						text: "Icon First",
						select: (event: CheckBox$SelectEvent) => {
							const selected = event.getParameters().selected;
							model.setProperty("/iconFirst", selected);
						},
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/enabled}",
						text: "Enabled",
					}),
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
		title: "ui5.touch.controls.Button",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Ghost,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Accept,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Attention,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Reject,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Critical,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Emphasized,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Success,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
				size: "{json>/size}",
			}),
			new SizedButton({
				text: "{json>/text}",
				type: ButtonType.Negative,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
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
		title: "sap.m.Button",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		justifyContent: FlexJustifyContent.SpaceBetween,
		items: [
			new Button({
				text: "{json>/text}",
				type: ButtonType.Ghost,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Accept,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Attention,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Reject,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Critical,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Emphasized,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Success,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
			}),
			new Button({
				text: "{json>/text}",
				type: ButtonType.Negative,
				icon: "{json>/icon}",
				iconFirst: "{json>/iconFirst}",
				enabled: "{json>/enabled}",
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

initTestPage("Button", page);
