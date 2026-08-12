import Localization from "sap/base/i18n/Localization";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import type { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import Theming from "sap/ui/core/Theming";
import Device from "sap/ui/Device";
import type JSONModel from "sap/ui/model/json/JSONModel";
import type { PageInfo } from "../model/pages";
import { allPages } from "../model/pages";
import BaseController from "./BaseController";

/**
 * Controller of the shell: side navigation, theme switch and the
 * previous/next buttons in the header.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class App extends BaseController {
	private model!: JSONModel;
	/** whether the window is wide enough for the side navigation */
	private wide = false;

	public onInit(): void {
		this.model = this.getOwnerComponent()?.getModel("app") as JSONModel;
		this.getRouter().attachRouteMatched((event) => {
			this.onRouteMatched(event);
		});

		// an unknown hash lands on the NotFound target, which is no page of the
		// navigation - so nothing is selected and there is nowhere to go next
		this.getRouter().attachBypassed(() => {
			this.select(-1, "");
		});

		// Whether the side navigation fits next to the content is a question of
		// the window, not of the device: a narrow window on a desktop has the
		// same problem as a phone, and there the navigation covers the content.
		Device.media.attachHandler(
			(range) => {
				this.applyRange(range.name);
			},
			undefined,
			Device.media.RANGESETS.SAP_STANDARD,
		);
		this.applyRange(
			Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD).name,
		);
	}

	/**
	 * Expands the side navigation only when there is room for it beside the
	 * content.
	 */
	private applyRange(range: string | undefined): void {
		this.wide = range === "Desktop";
		this.model.setProperty("/sideExpanded", this.wide);
	}

	/**
	 * Keeps the side navigation and the previous/next buttons in sync with the
	 * page the router has just displayed.
	 */
	private onRouteMatched(event: Router$RouteMatchedEvent): void {
		const name = event.getParameter("name") ?? "";
		this.select(
			allPages.findIndex((page) => page.key === name),
			name,
		);
	}

	/**
	 * Marks the page at the given index as the current one.
	 *
	 * @param index position in {@link allPages}, -1 when the page is none of
	 *   them
	 * @param key the route name, used as the key of the navigation item
	 */
	private select(index: number, key: string): void {
		const previous = index > 0 ? allPages[index - 1] : null;
		const next =
			index >= 0 && index < allPages.length - 1 ? allPages[index + 1] : null;

		this.model.setProperty("/currentKey", index >= 0 ? key : "");
		this.model.setProperty("/previousKey", previous?.key ?? "");
		this.model.setProperty("/previousText", this.getPageText(previous));
		this.model.setProperty("/nextKey", next?.key ?? "");
		this.model.setProperty("/nextText", this.getPageText(next));

		document.title =
			index >= 0
				? `ui5.touch.controls — ${this.getPageText(allPages[index])}`
				: "ui5.touch.controls";
	}

	/**
	 * Returns the name of a page in the current language. Only the
	 * introductory pages are translated - the others are named after their
	 * control.
	 */
	private getPageText(page: PageInfo | null): string {
		if (!page) {
			return "";
		}
		return page.textKey ? this.getText(page.textKey) : page.text;
	}

	public onMenuPress(): void {
		this.model.setProperty(
			"/sideExpanded",
			!(this.model.getProperty("/sideExpanded") as boolean),
		);
	}

	public onLogoPress(): void {
		this.getRouter().navTo(allPages[0].key);
	}

	/**
	 * Opens the npm package page. The mark is a button rather than a link so
	 * that the toolbar may move it into its overflow, and a button has to be
	 * told where to go.
	 */
	public onNpmPress(): void {
		window.open(
			"https://www.npmjs.com/package/ui5.touch.controls",
			"_blank",
			"noopener",
		);
	}

	public onNavigationSelect(event: SideNavigation$ItemSelectEvent): void {
		const key = event.getParameter("item")?.getProperty("key") as
			| string
			| undefined;
		if (key) {
			this.getRouter().navTo(key);
		}
	}

	/**
	 * Switches the language of the whole demo. UI5 reloads the resource bundle
	 * and re-renders everything, so nothing else has to be done here.
	 */
	public onLanguageChange(event: Select$ChangeEvent): void {
		const language = event.getParameter("selectedItem")?.getKey();
		if (language) {
			Localization.setLanguage(language);
		}
	}

	public onThemeChange(event: Select$ChangeEvent): void {
		const theme = event.getParameter("selectedItem")?.getKey();
		if (theme) {
			Theming.setTheme(theme);
		}
	}

	public onPreviousPress(): void {
		this.navigate("/previousKey");
	}

	public onNextPress(): void {
		this.navigate("/nextKey");
	}

	private navigate(path: string): void {
		const key = this.model.getProperty(path) as string;
		if (key) {
			this.getRouter().navTo(key);
		}
	}
}
