import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.sized.controls
 */
export default class SizedInput extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {},
		events: {},
	};

	static renderer = {
		render(rm: RenderManager, control: SizedInput) {},
	};
}
