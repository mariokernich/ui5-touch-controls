import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import type Router from "sap/ui/core/routing/Router";
import type UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import type ResourceModel from "sap/ui/model/resource/ResourceModel";
import { getApiUrl, getControlDoc } from "../model/documentation";

/** a code snippet shown in a card of a page */
export interface Snippet {
	/** the code itself */
	code: string;
	/** the CodeEditor language, e.g. "xml", "json", "sh" or "typescript" */
	language?: string;
	/** card title; without one the view falls back to a translated default */
	title?: string;
}

/**
 * Base class of all controllers of the demo application. It provides the
 * shortcuts every page needs - the router, the resource bundle and the
 * "example" model that feeds the code cards of a page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default abstract class BaseController extends Controller {
	/**
	 * Returns the router of the component.
	 */
	public getRouter(): Router {
		return (this.getOwnerComponent() as UIComponent).getRouter();
	}

	/**
	 * Returns the translated text for the given key.
	 */
	public getText(key: string, args?: (string | number)[]): string {
		const model = this.getOwnerComponent()?.getModel("i18n") as ResourceModel;
		return (
			(model.getResourceBundle() as ResourceBundle).getText(key, args) ?? key
		);
	}

	/**
	 * Fills the head of the page of a control - what the sap.m original is and
	 * what this library made of it.
	 *
	 * The texts come from the control table of the documentation page, so the
	 * two never drift apart, and the link points at the entity of the original
	 * in the OpenUI5 demo kit.
	 *
	 * @param name the key of the page, which is also the name of the control
	 */
	protected setControlIntro(name: string): void {
		const doc = getControlDoc(name);

		if (!doc) {
			return;
		}

		this.getView()?.setModel(
			new JSONModel({
				...doc,
				fullName: `ui5.touch.controls.${doc.name}`,
				docUrl: getApiUrl(doc.docEntity ?? doc.replaces),
			}),
			"control",
		);
	}

	/**
	 * Fills the code cards of a page.
	 *
	 * The snippets are passed through a model instead of being written into the
	 * XML view, because curly braces in a view would be parsed as binding syntax
	 * - and binding examples are the interesting ones. Every entry is a group of
	 * snippets that are shown one below the other; the view binds the group by
	 * its key, e.g. <code>items="{example&gt;/main}"</code>.
	 *
	 * @param groups the snippet groups by key, a plain string is treated as XML
	 */
	protected setSnippets(groups: Record<string, (Snippet | string)[]>): void {
		const data: Record<string, unknown[]> = {};

		for (const [key, snippets] of Object.entries(groups)) {
			data[key] = snippets.map((snippet) => {
				const normalized: Snippet =
					typeof snippet === "string" ? { code: snippet } : snippet;
				const code = normalized.code.trim();
				const language = normalized.language ?? "xml";

				return {
					code: code,
					language: language,
					// the CodeEditor does not grow with its content, so the height is
					// derived from the number of lines
					height: `${code.split("\n").length + 2}rem`,
					// an empty title means "use the default", which the view derives
					// from the language - resolving it here would freeze it in the
					// language that was active when the page was built
					title: normalized.title ?? "",
				};
			});
		}

		this.getView()?.setModel(new JSONModel(data), "example");
	}

	/**
	 * Fills the single example card at the bottom of a control page. It is the
	 * snippet group with the key "main", which the ExampleCard fragment binds.
	 *
	 * @param code the snippet to display
	 * @param language the CodeEditor language, defaults to "xml"
	 * @param title card title, defaults to the one the view derives from the
	 *   language
	 */
	protected setExample(code: string, language = "xml", title?: string): void {
		this.setSnippets({
			main: [{ code: code, language: language, title: title }],
		});
	}
}
