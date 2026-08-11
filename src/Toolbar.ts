import ToolbarBase from "sap/m/Toolbar";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { fitDialogFooter } from "./fitDialogFooter";

/**
 * @namespace ui5.touch.controls
 */
export default class Toolbar extends ToolbarBase {
	static readonly metadata: MetadataOptions = {
		interfaces: ["sap.ui.core.Toolbar", "sap.m.IBar"],
		defaultAggregation: "content",
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

	constructor(idOrSettings?: string | $ToolbarSettings_1);
	constructor(id?: string, settings?: $ToolbarSettings_1);
	constructor(id?: string, settings?: $ToolbarSettings_1) {
		super(id, settings);
	}

	onAfterRendering(event: jQuery.Event): void {
		super.onAfterRendering(event);
		fitDialogFooter(this);
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
