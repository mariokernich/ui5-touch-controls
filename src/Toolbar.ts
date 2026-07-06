import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { default as OriginalToolbar } from "sap/m/Toolbar";

/**
 * @namespace ui5.touch.controls
 */
export default class Toolbar extends Control {
	static readonly metadata: MetadataOptions = {
		interfaces: ["sap.ui.core.Toolbar", "sap.m.IBar"],
		defaultAggregation: "content",
		associations: {
			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: {
				type: "sap.ui.core.Control",
				multiple: true,
				singularName: "ariaLabelledBy",
			},
		},
		aggregations: {
			/**
			 * The content of the toolbar.
			 */
			content: {
				type: "sap.ui.core.Control",
				multiple: true,
				singularName: "content",
			},
		},
	};

	constructor(idOrSettings?: string | $ToolbarSettings);
	constructor(id?: string, settings?: $ToolbarSettings);
	constructor(id?: string, settings?: $ToolbarSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Toolbar) {
			rm.openStart("div", control);
			//rm.class("sapMTB");
			rm.class("sapMTBStandard");
			rm.class("sapMTBNewFlex");
			rm.class("sapMOTB");
			rm.class("sapMIBar");
			rm.class("sizedToolbar");
			rm.openEnd();

			control.getContent().forEach(function (oControl) {
				oControl.addStyleClass("sapMBarChild");
				rm.renderControl(oControl);
			});

			rm.close("div");
		},
	};
}
