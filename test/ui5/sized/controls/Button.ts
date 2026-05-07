import Button from "sap/m/Button";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { ButtonType, FlexJustifyContent } from "sap/m/library";
import Select from "sap/m/Select";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/sized/controls/Button";
import { SizeMode } from "ui5/sized/controls/library";

const model = new JSONModel(
	{
		showIcon: true,
		icon: "sap-icon://accounting-document-verification",
		showText: true,
		text: "Button",
		iconFirst: true,
		size: SizeMode.M,
	},
	true,
);

const page = new VBox();

const options = new HBox({
	items: [
		new Input({
			value: "{json>/text}",
			placeholder: "Button Text",
			valueLiveUpdate: true,
			width: "200px",
		}).addStyleClass("sapUiMediumMarginBegin"),
		new Input({
			value: "{json>/icon}",
			placeholder: "Button Icon",
			valueLiveUpdate: true,
			width: "300px",
		}).addStyleClass("sapUiMediumMarginBegin"),
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
		}).addStyleClass("sapUiMediumMarginBegin"),
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
		}).addStyleClass("sapUiMediumMarginBegin"),
		new CheckBox({
			selected: "{json>/iconFirst}",
			text: "Icon First",
			select: (event: CheckBox$SelectEvent) => {
				const selected = event.getParameters().selected;
				model.setProperty("/iconFirst", selected);
			},
		}).addStyleClass("sapUiMediumMarginBegin"),
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
		}).addStyleClass("sapUiMediumMarginBegin"),
	],
}).addStyleClass("sapUiMediumMarginBottom");

const sized = new VBox({
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
	.addStyleClass("sapUiLargeMarginEnd");

const sapM = new VBox({
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
});

page.addItem(options);
page.addItem(
	new HBox({
		items: [sized, sapM],
	}),
);

page.setModel(model, "json");

page.placeAt("content");
