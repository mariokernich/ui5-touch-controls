import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.touch.controls
 */
export default class Input extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {},
		events: {},
	};

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Input) {},
	};
}
