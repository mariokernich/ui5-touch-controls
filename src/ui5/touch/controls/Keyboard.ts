import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import { default as SimpleKeyboard } from "simple-keyboard";

/**
 * @namespace ui5.touch.controls
 */
export default class Keyboard extends Control {
    protected keyboard?: SimpleKeyboard;

    static readonly metadata: MetadataOptions = {
    }

    public onAfterRendering(): void {
        this.keyboard = new SimpleKeyboard();
    }

    public static renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: Keyboard) {
			rm.openStart("div", control)
			  .openEnd()
			  .close("div");
		},
	};
}