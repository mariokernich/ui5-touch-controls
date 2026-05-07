import Button from "sap/m/Button";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import HBox from "sap/m/HBox";
import { ButtonType, FlexJustifyContent } from "sap/m/library";
import StepInput from "sap/m/StepInput";
import VBox from "sap/m/VBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import SizedButton from "ui5/sized/controls/SizedButton";

const model = new JSONModel(
	{
		showIcon: true,
		icon: "sap-icon://accounting-document-verification",
		showText: true,
		text: "Button",
		iconFirst: true,
		height: "50px",
		sidePadding: "20px",
	},
	true,
);

const page = new VBox();

const options = new HBox({
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
		new StepInput({
			value: 50,
			min: 0,
			step: 3,
			width: "150px",
			change: (event) => {
				const value = event.getParameter("value");
				model.setProperty("/height", value + "px");
			},
		}).addStyleClass("sapUiMediumMarginBegin"),
		new StepInput({
			value: 20,
			min: 0,
			step: 3,
			width: "150px",
			change: (event) => {
				const value = event.getParameter("value");
				model.setProperty("/sidePadding", value + "px");
			},
		}).addStyleClass("sapUiMediumMarginBegin"),
	],
}).addStyleClass("sapUiMediumMarginBottom");

const sized = new HBox({
	justifyContent: FlexJustifyContent.SpaceBetween,
	items: [
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Default,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Ghost,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Accept,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Attention,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Reject,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Critical,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Emphasized,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Success,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Up,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
		new SizedButton({
			text: "{json>/text}",
			type: ButtonType.Negative,
			icon: "{json>/icon}",
			iconFirst: "{json>/iconFirst}",
			height: "{json>/height}",
			sidePadding: "{json>/sidePadding}",
		}),
	],
}).addStyleClass("sapUiMediumMarginBottom");

const sapM = new HBox({
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
page.addItem(sized);
page.addItem(sapM);

page.setModel(model, "json");

page.placeAt("content");
