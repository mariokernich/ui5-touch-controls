/**
 * The QUnit test suite of the library, read by the UI5 test starter - see
 * testsuite.qunit.html.
 *
 * There is one page, unit/unitTests, which loads the test module of every
 * control. It runs in the browser like the controls do, and on every UI5
 * release the test page is started with: the UI tests open it once per
 * release, see e2e/unit.test.js.
 */
export default {
	name: "QUnit test suite of ui5.touch.controls",
	defaults: {
		qunit: {
			version: 2,
			// in the order they are written, not the ones that failed last
			// time first - so every run is the same run
			reorder: false,
		},
		sinon: false,
		ui5: {
			libs: ["sap.m", "ui5.touch.controls"],
			theme: "sap_horizon",
			language: "en",
			// the same switches as the test page and the demo
			compatVersion: "edge",
			async: true,
		},
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests of ui5.touch.controls",
		},
	},
};
