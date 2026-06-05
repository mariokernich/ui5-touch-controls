import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import Button from "sap/m/Button";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import { ButtonType, FlexJustifyContent } from "sap/m/library";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";

const model = new JSONModel(
	{
		showIcon: true,
		icon: "sap-icon://accounting-document-verification",
		showText: true,
		text: "Button",
		iconFirst: true,
		size: SizeMode.M,
		theme: "sap_horizon",
	},
	true,
);

const page = new VBox();

const options = new Card({
	header: new Header({
		title: "Button Options",
	}),
	content: [
		new VBox({
			items: [
				new HBox({
					alignItems: FlexJustifyContent.Center,
					items: [
						new Text({ text: "Button Size", width: "100px" }),
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
						new Text({ text: "Button Theme", width: "100px" }),
						new Select({
							selectedKey: "{json>/theme}",
							items: [
								new Item({ key: "sap_horizon", text: "Horizon" }),
								new Item({ key: "sap_horizon_dark", text: "Horizon Dark" }),
								new Item({ key: "sap_horizon_hcb", text: "Horizon HCB" }),
								new Item({ key: "sap_horizon_hcw", text: "Horizon HCW" }),
								new Item({ key: "sap_fiori_3", text: "Fiori 3" }),
								new Item({ key: "sap_fiori_3_dark", text: "Fiori 3 Dark" }),
							],
							change: (event) => {
								const selectedKey = event
									.getParameter("selectedItem")
									?.getKey();
								if (selectedKey) {
									sap.ui.getCore().applyTheme(selectedKey);
								}
							},
						}),
					],
				}),
				new HBox({
					alignItems: FlexJustifyContent.Center,
					items: [
						new Text({ text: "Button Text", width: "100px" }),
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
						new Text({ text: "Button Icon", width: "100px" }),
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
						new Text({ text: "Button Size", width: "100px" }),
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
						new Text({ text: "Button Theme", width: "100px" }),
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
						new Text({ text: "Icon Position", width: "100px" }),
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
			],
		})
			.addStyleClass("sapUiSmallMarginBegin")
			.addStyleClass("sapUiSmallMarginEnd")
			.addStyleClass("sapUiSmallMarginBottom"),
	],
}).addStyleClass("sapUiMediumMarginBottom");

const sized = new Card({
	header: new Header({
		title: "ui5.touch.controls.Button",
	}),
	content: [
		new VBox({
			justifyContent: FlexJustifyContent.SpaceBetween,
			items: [
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Default,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Ghost,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Accept,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Attention,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Reject,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Critical,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Emphasized,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Success,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Up,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
				new SizedButton({
					text: "{json>/text}",
					type: ButtonType.Negative,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
					size: "{json>/size}",
				}),
			],
		})
			.addStyleClass("sapUiLargeMarginBegin")
			.addStyleClass("sapUiLargeMarginEnd")
			.addStyleClass("sapUiLargeMarginBottom"),
	],
});

const sapM = new Card({
	header: new Header({
		title: "sap.m.Button",
	}),
	content: [
		new VBox({
			justifyContent: FlexJustifyContent.SpaceBetween,
			items: [
				new Button({
					text: "{json>/text}",
					type: ButtonType.Default,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Ghost,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Accept,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Attention,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Reject,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Critical,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Emphasized,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Success,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Up,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
				new Button({
					text: "{json>/text}",
					type: ButtonType.Negative,
					icon: "{json>/icon}",
					iconFirst: "{json>/iconFirst}",
				}),
			],
		}),
	],
});

page.addItem(options);
page.addItem(
	new HBox({
		items: [sized, sapM],
	}),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

page.placeAt("content");
