import { MetadataOptions } from "sap/ui/core/Element";
import Control from "sap/ui/core/Control";
import type RenderManager from "sap/ui/core/RenderManager";
import hljs from "highlight.js/lib/common";

/**
 * @namespace ui5.touch.controls.demo.control
 */
export default class CodeBlock extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			text: { type: "string", defaultValue: "" },
			language: { type: "string", defaultValue: "" },
		},
	};

	constructor(idOrSettings?: string | $CodeBlockSettings);
	constructor(id?: string, settings?: $CodeBlockSettings);
	constructor(id?: string, settings?: $CodeBlockSettings) {
		super(id, settings);
	}

	onAfterRendering() {
		const codeElement = this.getDomRef()?.querySelector("code");
		if (!codeElement) {
			return;
		}

		const code = codeElement.textContent ?? "";
		const language = this.getLanguage();

		// A stated language beats guessing: highlightAuto picks by scoring, and
		// on a short snippet - a single npm install line, a handful of JSON keys
		// - the scores lie close together and it settles on the wrong grammar.
		// getLanguage() is what guards the call: highlight() throws on a
		// language that was never registered, and the "common" bundle carries
		// only the widespread ones.
		if (language && hljs.getLanguage(language)) {
			codeElement.innerHTML = hljs.highlight(code, {
				language: language,
			}).value;
			return;
		}

		codeElement.innerHTML = hljs.highlightAuto(code).value;
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: CodeBlock) {
			rm.openStart("pre", control);
			rm.class("ui5tcCodeBlock");
			rm.openEnd();
			rm.openStart("code");
			rm.openEnd();
			rm.text(control.getText());
			rm.close("code");
			rm.close("pre");
		},
	};
}
