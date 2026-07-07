/*!
 * ${copyright}
 */

import Lib from "sap/ui/core/Lib";

// library dependencies must also be imported here
import "sap/ui/core/library";

/**
 * Initialization Code and shared classes of library ui5.touch.controls.
 */

/**
 * Available modes for the Button control.
 *
 * @enum {string}
 * @namespace ui5.touch.controls
 */
export enum SizeMode {
	S = "S",
	M = "M",
	L = "L",
	XL = "XL",
	XXL = "XXL",
	XXXL = "XXXL",
}

// delegate further initialization of this library to the Core
const thisLib: { [key: string]: unknown } = Lib.init({
	name: "ui5.touch.controls",
	version: "${version}",
	dependencies: [
		// keep in sync with the ui5.yaml and .library files
		"sap.ui.core",
	],
	types: ["ui5.touch.controls.SizeMode"],
	interfaces: [],
	controls: [
		"ui5.touch.controls.Button",
		"ui5.touch.controls.Input",
		"ui5.touch.controls.Keyboard",
		"ui5.touch.controls.Text",
		"ui5.touch.controls.Toolbar",
	],
	elements: [],
	noLibraryCSS: false, // if no CSS is provided, you can disable the library.css load here
}) as { [key: string]: unknown };

thisLib.SizeMode = SizeMode;

// export the library namespace
export default thisLib;
