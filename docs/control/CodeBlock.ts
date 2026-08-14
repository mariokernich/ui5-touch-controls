import { MetadataOptions } from "sap/ui/core/Element";
import Control from "sap/ui/core/Control";
import type RenderManager from "sap/ui/core/RenderManager";
import Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";
import type ResourceModel from "sap/ui/model/resource/ResourceModel";
import hljs from "highlight.js/lib/common";

/**
 * @namespace ui5.touch.controls.demo.control
 */
export default class CodeBlock extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			text: { type: "string", defaultValue: "" },
			language: { type: "string", defaultValue: "" },
			showCopyButton: { type: "boolean", defaultValue: false },
		},
		aggregations: {
			_copyButton: {
				type: "sap.m.Button",
				multiple: false,
				visibility: "hidden",
			},
		},
	};

	constructor(idOrSettings?: string | $CodeBlockSettings);
	constructor(id?: string, settings?: $CodeBlockSettings);
	constructor(id?: string, settings?: $CodeBlockSettings) {
		super(id, settings);
	}

	init() {
		this.setAggregation(
			"_copyButton",
			new Button({
				icon: "sap-icon://copy",
				type: "Transparent",
				press: () => void this.onCopy(),
			}).addStyleClass("ui5tcCodeBlockCopy"),
		);
	}

	private async onCopy() {
		const text = this.getText();
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// the async clipboard API needs a focused, secure document - fall
			// back to the selection based way when it refuses
			const helper = document.createElement("textarea");
			helper.value = text;
			helper.style.position = "fixed";
			helper.style.opacity = "0";
			document.body.appendChild(helper);
			helper.select();
			document.execCommand("copy");
			helper.remove();
		}
		const model = this.getModel("i18n") as ResourceModel | undefined;
		MessageToast.show((model?.getProperty("copied") as string) ?? "Copied");
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
			rm.openStart("div", control);
			rm.class("ui5tcCodeBlockWrapper");
			rm.openEnd();
			if (control.getShowCopyButton()) {
				rm.renderControl(control.getAggregation("_copyButton") as Button);
			}
			rm.openStart("pre");
			rm.class("ui5tcCodeBlock");
			rm.openEnd();
			rm.openStart("code");
			rm.openEnd();
			rm.text(control.getText());
			rm.close("code");
			rm.close("pre");
			rm.close("div");
		},
	};
}
