import type { Select$ChangeEvent } from "sap/m/Select";
import type { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import type ToolPage from "sap/tnt/ToolPage";
import type { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import Theming from "sap/ui/core/Theming";
import type JSONModel from "sap/ui/model/json/JSONModel";
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
		this.model.setProperty(
			"/previousTooltip",
			previous ? `${this.getText("previous")}: ${previous.text}` : "",
		);
		this.model.setProperty("/nextKey", next?.key ?? "");
		this.model.setProperty(
			"/nextTooltip",
			next ? `${this.getText("next")}: ${next.text}` : "",
		);

		document.title =
			index >= 0
				? `ui5.touch.controls — ${allPages[index].text}`
				: "ui5.touch.controls";
	}

	public onMenuPress(): void {
		const toolPage = this.byId("toolPage") as ToolPage;
		toolPage.setSideExpanded(!toolPage.getSideExpanded());
	}

	public onLogoPress(): void {
		this.getRouter().navTo(allPages[0].key);
	}

	public onNavigationSelect(event: SideNavigation$ItemSelectEvent): void {
		const key = event.getParameter("item")?.getProperty("key") as
			| string
			| undefined;
		if (key) {
			this.getRouter().navTo(key);
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
