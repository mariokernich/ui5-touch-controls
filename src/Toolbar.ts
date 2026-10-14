import ToolbarBase from "sap/m/Toolbar";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { fitDialogBars } from "./fitDialogBars";
import { fitPageBars } from "./fitPageBars";
import { ISized, SizeMode, sizeClass } from "./library";

/**
 * @namespace ui5.touch.controls
 */
export default class Toolbar extends ToolbarBase implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: [
			"sap.ui.core.Toolbar",
			"sap.m.IBar",
			"ui5.touch.controls.ISized",
		],
		defaultAggregation: "content",
		properties: {
			/**
			 * Touch size of the toolbar: it is at least as tall as a button of
			 * this size, so it keeps its height when its content changes.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
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

	constructor(idOrSettings?: string | $ToolbarSettings_1);
	constructor(id?: string, settings?: $ToolbarSettings_1);
	constructor(id?: string, settings?: $ToolbarSettings_1) {
		super(id, settings);
	}

	onAfterRendering(event: jQuery.Event): void {
		super.onAfterRendering(event);
		fitDialogBars(this);
		fitPageBars(this);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Toolbar) {
			rm.openStart("div", control);
			//rm.class("sapMTB");
			// Standard draws a line below the toolbar, Clear does not - the
			// same classes sap.m.Toolbar renders for its style
			rm.class("sapMTB" + control.getStyle());
			rm.class("sapMTBNewFlex");
			rm.class("sapMOTB");
			rm.class("sapMIBar");
			rm.class("sizedToolbar");
			rm.class(sizeClass(control.getSize()));
			rm.openEnd();

			control.getContent().forEach(function (oControl) {
				oControl.addStyleClass("sapMBarChild");
				rm.renderControl(oControl);
			});

			rm.close("div");
		},
	};
}
