import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import type Router from "sap/ui/core/routing/Router";
import type UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import type ResourceModel from "sap/ui/model/resource/ResourceModel";
import { getApiUrl, getControlDoc, NEW_CONTROL } from "../model/documentation";

/** a code snippet shown in a card of a page */
export interface Snippet {
	/** the code itself */
	code: string;
	/** the highlight.js language, e.g. "xml", "json", "sh" or "typescript" */
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
	 * in the UI5 demo kit.
	 *
	 * @param name the key of the page, which is also the name of the control
	 */
	protected setControlIntro(name: string): void {
		const doc = getControlDoc(name);

		if (!doc) {
			return;
		}

		// a base class of this library that has a page of its own is linked to
		// that page instead of to the demo kit, which does not know it
		const extendsDoc = getControlDoc(
			doc.extendsClass.replace("ui5.touch.controls.", ""),
		);

		this.getView()?.setModel(
			new JSONModel({
				...doc,
				fullName: `ui5.touch.controls.${doc.name}`,
				docUrl: getApiUrl(doc.docEntity ?? doc.replaces),
				// a base class that is not in the demo kit gets no link there;
				// if it has a page here, extendsKey points at it, and where
				// there is neither the view renders the name as plain text
				extendsUrl: getApiUrl(doc.extendsClass),
				extendsKey: extendsDoc?.name ?? "",
				visibility: doc.visibility ?? "public",
				// a control without a sap.m original has no "Original" fact
				showOriginal: doc.replaces !== NEW_CONTROL,
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
				// The sources are written as template literals in tab-indented
				// files, so the samples arrive tab-indented too. A tab in a
				// <pre> is rendered at the browser's tab stop - eight columns -
				// which reads far too deep for a short snippet. Two spaces per
				// level is what the code cards show instead.
				const code = normalized.code
					.trim()
					.replace(/^\t+/gm, (tabs) => "  ".repeat(tabs.length));
				const language = normalized.language ?? "xml";

				return {
					code: code,
					language: language,
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
	 * @param language the highlight.js language, defaults to "xml"
	 * @param title card title, defaults to the one the view derives from the
	 *   language
	 */
	protected setExample(code: string, language = "xml", title?: string): void {
		this.setSnippets({
			main: [{ code: code, language: language, title: title }],
		});
	}

	/**
	 * Opens the page of the base class the control extends. Bound by the pages
	 * whose base class is one of this library.
	 */
	public onNavToExtends(): void {
		const key = (
			this.getView()?.getModel("control") as JSONModel | undefined
		)?.getProperty("/extendsKey") as string | undefined;

		if (key) {
			this.getRouter().navTo(key);
		}
	}
}
