import Theming from "sap/ui/core/Theming";
import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
import {
	additionalPages,
	allPages,
	introPages,
	portedPages,
} from "./model/pages";
import { getLogoUrl } from "./model/theme";

/**
 * Component of the demo application.
 *
 * The application shows every control of the library on its own page. The
 * pages are wired together by the router, the page list lives in
 * {@link module:ui5/touch/controls/demo/model/pages}.
 *
 * @namespace ui5.touch.controls.demo
 */
export default class Component extends UIComponent {
	public static readonly metadata = {
		manifest: "json",
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
	};

	public init(): void {
		super.init();

		// state of the shell: theme, logo and where the previous/next buttons
		// lead to. The pages read the logo from here as well.
		const app = new JSONModel({
			currentKey: allPages[0].key,
			previousKey: "",
			previousTooltip: "",
			nextKey: "",
			nextTooltip: "",
			theme: Theming.getTheme(),
			logo: getLogoUrl(Theming.getTheme()),
		});
		this.setModel(app, "app");

		// the theme can also change from outside, e.g. through a URL parameter
		Theming.attachApplied(() => {
			const theme = Theming.getTheme();
			app.setProperty("/theme", theme);
			app.setProperty("/logo", getLogoUrl(theme));
		});

		// drives the side navigation
		this.setModel(
			new JSONModel({
				intro: introPages,
				ported: portedPages,
				additional: additionalPages,
			}),
			"pages",
		);

		// used to collapse the side navigation on phones and tablets
		const device = new JSONModel(Device);
		device.setDefaultBindingMode("OneWay");
		this.setModel(device, "device");

		this.getRouter().initialize();
	}
}
