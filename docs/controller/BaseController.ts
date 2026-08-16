import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import type PropertyBinding from "sap/ui/model/PropertyBinding";
import Controller from "sap/ui/core/mvc/Controller";
import type Router from "sap/ui/core/routing/Router";
import type UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import type ResourceModel from "sap/ui/model/resource/ResourceModel";
import type { ApiMember } from "../model/api";
import { getApi } from "../model/api";
import {
	getApiUrl,
	getControlDoc,
	getSources,
	NEW_CONTROL,
} from "../model/documentation";

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
	/** what {@link fillOnLanguageChange} listens on, so it can be taken back */
	private languageBinding?: PropertyBinding;

	/** what {@link fillOnLanguageChange} was given, in the order it came in */
	private fills: (() => void)[] = [];

	/** what {@link followDockedKeyboard} listens on, so it can be taken back */
	private dockedBinding?: PropertyBinding;

	/**
	 * Returns the router of the component.
	 */
	public getRouter(): Router {
		return (this.getOwnerComponent() as UIComponent).getRouter();
	}

	/**
	 * Fills a part of a page now, and again whenever the language changes.
	 *
	 * A text bound against the i18n model follows a language switch by itself
	 * - UI5 re-evaluates the binding. A text read with {@link getText} does
	 * not: it is a value in a JSON model by then, and nothing tells the model
	 * that the bundle underneath has changed. That is what this is for.
	 *
	 * It is meant for what the visitor cannot edit - the entries of a list,
	 * for instance. The value a field starts on is deliberately left out: a
	 * playground is there to be typed in, and refilling it on a language
	 * switch would throw that away.
	 *
	 * It may be called more than once - a page fills its own list and inherits
	 * the API cards on top of that. All of them are run on one binding.
	 */
	protected fillOnLanguageChange(fill: () => void): void {
		fill();
		this.fills.push(fill);

		if (this.languageBinding) {
			return;
		}

		const model = this.getOwnerComponent()?.getModel("i18n") as
			| ResourceModel
			| undefined;

		if (!model) {
			return;
		}

		// A binding against the bundle is what says that the language has
		// changed - which is exactly the signal the views themselves listen
		// to. The announcement of the change comes earlier than that and is of
		// no use here: while it is being handed around, the model can still
		// carry the bundle of the language that is on its way out, and the
		// refill would put that one back. The value of the binding is never
		// read; the key below is only a key that exists.
		this.languageBinding = model.bindProperty("/appTitle");
		this.languageBinding.attachChange(() => {
			this.fills.forEach((refill) => {
				refill();
			});
		});
	}

	/**
	 * Takes back what {@link fillOnLanguageChange} registered. A controller
	 * that overrides this has to call it.
	 */
	public onExit(): void {
		this.languageBinding?.destroy();
		this.languageBinding = undefined;
		this.fills = [];

		this.dockedBinding?.destroy();
		this.dockedBinding = undefined;
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
				// the entry holds the keys of its sentences; the view binds the
				// sentences themselves
				summary: this.getText(doc.summaryKey),
				description: this.getText(doc.descriptionKey),
				original: doc.originalKey ? this.getText(doc.originalKey) : "",
				fullName: `ui5.touch.controls.${doc.name}`,
				docUrl: getApiUrl(doc.docEntity ?? doc.replaces),
				// a base class that is not in the demo kit gets no link there;
				// if it has a page here, extendsKey points at it, and where
				// there is neither the view renders the name as plain text
				extendsUrl: getApiUrl(doc.extendsClass),
				extendsKey: extendsDoc?.name ?? "",
				visibility: doc.visibility ?? "public",
				// the files the class is written in, and where to read them
				sources: getSources(doc.name),
				// a control without a sap.m original has no "Original" fact
				showOriginal: doc.replaces !== NEW_CONTROL,
			}),
			"control",
		);
	}

	/**
	 * Fills the API cards of the page of a control - one for its properties,
	 * one for its events, one for its aggregations.
	 *
	 * The facts come from the API model, the sentences from the resource
	 * bundle, so the tables follow the language switch. The three kinds are
	 * flagged rather than counted in the view: a card whose kind the control
	 * has none of is left out, and few controls have all three.
	 *
	 * @param name the key of the page, which is also the name of the control
	 */
	protected setApi(name: string): void {
		const doc = getApi(name);

		if (!doc) {
			return;
		}

		const model = new JSONModel();
		this.getView()?.setModel(model, "api");

		const fill = (members?: ApiMember[]) =>
			(members ?? []).map((member) => ({
				...member,
				text: this.getText(member.textKey),
			}));

		this.fillOnLanguageChange(() => {
			model.setData({
				properties: fill(doc.properties),
				events: fill(doc.events),
				aggregations: fill(doc.aggregations),
				hasProperties: !!doc.properties?.length,
				hasEvents: !!doc.events?.length,
				hasAggregations: !!doc.aggregations?.length,
				inherits: doc.inherits ?? "",
			});
		});
	}

	/**
	 * Lets the footer of the shell step aside while the page shows a docked
	 * keyboard.
	 *
	 * A docked keyboard sits at the bottom edge of the screen, over everything
	 * - and that is where the footer stands. The two overlap by the height of
	 * the footer, and which of them is seen then rests on a single z-index
	 * ranking surviving every stacking context between the keyboard and the
	 * shell, plus on the browser compositing a fixed element the way the
	 * ranking says. That holds here and did not hold on a phone. So the two are
	 * kept out of each other's way instead: while a keyboard is docked, the
	 * footer is not there to be argued with - which is also what a phone does
	 * with its own bottom bar when its keyboard comes up.
	 *
	 * What is written down is the page that has one, not a yes or no: the
	 * footer belongs to the shell and outlives the page, and a page that is
	 * navigated away from is not destroyed - the NavContainer keeps it, so
	 * there is no moment at which it could take back a yes. The footer compares
	 * the note with the page that is open (see the Footer fragment), which
	 * needs no taking back and is right again the moment the visitor comes
	 * back to a page whose keyboard is still docked.
	 *
	 * @param key the key of the page, which is also its route name
	 * @param model the model of the page
	 * @param path the property that says whether the keyboard is docked
	 */
	protected followDockedKeyboard(
		key: string,
		model: JSONModel,
		path = "/docked",
	): void {
		const app = this.getOwnerComponent()?.getModel("app") as
			| JSONModel
			| undefined;

		if (!app) {
			return;
		}

		const tell = () => {
			app.setProperty("/dockedOn", model.getProperty(path) ? key : "");
		};

		this.dockedBinding = model.bindProperty(path);
		this.dockedBinding.attachChange(tell);
		tell();
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
