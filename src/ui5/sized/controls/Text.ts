import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";

/**
 * @namespace ui5.sized.controls
 */
export default class Text extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {},
		events: {},
	};

	static renderer = {
		render(rm: RenderManager, control: Text) {},
	};
}
