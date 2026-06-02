import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.touch.controls
 */
export default class Toolbar extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			active: { type: "boolean", group: "Behavior", defaultValue: false },
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
		},
		events: {},
		aggregations: {
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
		render(rm: RenderManager, toolbar: Toolbar) {
			let firstVisibleControl: Control | null = null;
			toolbar.getContent().forEach((control) => {
				if (control.isA("sap.ui.core.HTML")) {
					rm.renderControl(control);
				} else {
					(control as Control).addStyleClass("sapMBarChild");
					if (!firstVisibleControl && (control as Control).getVisible()) {
						(control as Control).addStyleClass("sapMBarChildFirstChild");
						firstVisibleControl = control;
					} else {
						(control as Control).removeStyleClass("sapMBarChildFirstChild");
					}
					rm.renderControl(control);
				}
			});
		},
	};
}
