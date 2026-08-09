import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ISized, SizeMode, sizeClass } from "./library";

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
			rm.openStart("div", control);
			rm.class("sizedText");
			rm.class(sizeClass(control.getSize()));
			rm.style("color", control.getColor());
			rm.openEnd();
			rm.text(control.getText());
			rm.close("div");
		},
	};
}
