export default {
	name: "QUnit TestSuite for ui5.sized.controls",
	defaults: {
		ui5: {
			libs: ["sap.ui.core", "ui5.sized.controls"],
			theme: "sap_horizon"
		},
		qunit: {
			version: 2,
			reorder: false
		},
		sinon: {
			version: 4,
			qunitBridge: true,
			useFakeTimers: false
		}
	},
	tests: {
		// test file for the Example control
		Example: {
			title: "QUnit Test for Example",
			_alternativeTitle: "QUnit tests: ui5.sized.controls.Example"
		}
	}
};
