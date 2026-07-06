import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";

/**
 * @namespace ui5.touch.controls
 */
export default class Text extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			text: { type: "string", defaultValue: "" },
			color: { type: "sap.ui.core.CSSColor", defaultValue: null },
			fontSize: { type: "sap.ui.core.CSSSize", defaultValue: null },
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

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Text) {
			rm.openStart("div", control);
			rm.style("color", control.getColor());
			if (control.getFontSize()) {
				rm.style("font-size", control.getFontSize());
			}
			rm.openEnd();
			rm.text(control.getText());
			rm.close("div");
		},
	};
}
