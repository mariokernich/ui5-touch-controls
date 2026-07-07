import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ISized, SizeMode } from "./library";

/**
 * @namespace ui5.touch.controls
 */
export default class Text extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			text: { type: "string", defaultValue: "" },
			color: { type: "sap.ui.core.CSSColor", defaultValue: null },
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			press: {},
		},
	};

	constructor(idOrSettings?: string | $TextSettings);
	constructor(id?: string, settings?: $TextSettings);
	constructor(id?: string, settings?: $TextSettings) {
		super(id, settings);
	}

	ontap(): void {
		this.firePress();
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Text) {
			let fontSize;
			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					break;
				case SizeMode.XXL:
					fontSize = "1.25rem";
					break;
				case SizeMode.XXXL:
					fontSize = "1.5rem";
					break;
			}

			rm.openStart("div", control);
			rm.style("color", control.getColor());
			rm.style("font-size", fontSize);
			rm.openEnd();
			rm.text(control.getText());
			rm.close("div");
		},
	};
}
