import Card from "sap/f/Card";
import Header from "sap/f/cards/Header";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import { FlexJustifyContent } from "sap/m/library";
import MessageStrip from "sap/m/MessageStrip";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import { ValueState } from "sap/ui/core/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import Button from "ui5/touch/controls/Button";
import QuickDialog, { MessageAction } from "ui5/touch/controls/QuickDialog";
import initTestPage, { createExampleCard } from "./Menu";

const model = new JSONModel(
	{
		title: "QuickDialog",
		message: "This is a QuickDialog message.",
		size: SizeMode.L,
		state: "None",
		toolbarSpacer: false,
		lastResult: "—",
	},
	true,
);

const page = new VBox();

function getBaseOptions() {
	return {
		title: model.getProperty("/title") as string,
		state: model.getProperty("/state") as ValueState,
		size: model.getProperty("/size") as SizeMode,
		toolbarSpacer: model.getProperty("/toolbarSpacer") as boolean,
	};
}

function setResult(result: string): void {
	model.setProperty("/lastResult", result);
}

function actionLabel(action: MessageAction | string): string {
	return typeof action === "string" ? action : MessageAction[action];
}

async function runShow(
	actions: Array<MessageAction | string>,
	emphasized?: MessageAction | string,
) {
	try {
		const action = await QuickDialog.show({
			...getBaseOptions(),
			message: model.getProperty("/message") as string,
			actions,
			emphasizedAction: emphasized,
		});
		setResult(`show → ${actionLabel(action)}`);
	} catch {
		setResult("show → rejected (escape)");
	}
}

/**
 * Wraps a test button together with a short description text above it.
 */
function describedButton(button: Button, description: string): VBox {
	return new VBox({
		items: [
			new Text({ text: description }).addStyleClass("sapUiTinyMarginBottom"),
			button,
		],
	}).addStyleClass("sapUiTinyMarginBottom");
}

const options = new Card({
	header: new Header({
		title: "QuickDialog Options",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Size", width: "60px" }),
					new Select({
						selectedKey: "{json>/size}",
						items: [
							new Item({ key: "S", text: "S" }),
							new Item({ key: "M", text: "M" }),
							new Item({ key: "L", text: "L" }),
							new Item({ key: "XL", text: "XL" }),
							new Item({ key: "2XL", text: "2XL" }),
							new Item({ key: "3XL", text: "3XL" }),
							new Item({ key: "4XL", text: "4XL" }),
							new Item({ key: "5XL", text: "5XL" }),
							new Item({ key: "6XL", text: "6XL" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Title", width: "60px" }),
					new Input({
						value: "{json>/title}",
						placeholder: "Dialog Title",
						valueLiveUpdate: true,
						width: "200px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "Message", width: "60px" }),
					new Input({
						value: "{json>/message}",
						placeholder: "Dialog Message",
						valueLiveUpdate: true,
						width: "300px",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({ text: "State", width: "60px" }),
					new Select({
						selectedKey: "{json>/state}",
						items: [
							new Item({ key: "None", text: "None" }),
							new Item({
								key: "Information",
								text: "Information",
							}),
							new Item({ key: "Success", text: "Success" }),
							new Item({ key: "Warning", text: "Warning" }),
							new Item({ key: "Error", text: "Error" }),
						],
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new CheckBox({
						selected: "{json>/toolbarSpacer}",
						text: "Toolbar Spacer (adds space between the buttons in the dialog footer)",
						tooltip:
							"When enabled, a ToolbarSpacer is inserted between the action buttons, spreading them apart instead of grouping them together.",
					}),
				],
			}),
			new HBox({
				alignItems: FlexJustifyContent.Center,
				items: [
					new Text({
						text: "Last result",
						width: "80px",
					}),
					new MessageStrip({
						text: "{json>/lastResult}",
						showIcon: true,
					}),
				],
			}).addStyleClass("sapUiSmallMarginTop"),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom"),
}).addStyleClass("sapUiMediumMarginBottom");

const showCard = new Card({
	header: new Header({
		title: "QuickDialog.show",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			describedButton(
				new Button({
					text: "show (Ok)",
					size: "{json>/size}",
					press: () => {
						void runShow([MessageAction.Ok], MessageAction.Ok);
					},
				}),
				"Simple message dialog with a single emphasized Ok button.",
			),
			describedButton(
				new Button({
					text: "show (Yes / No)",
					size: "{json>/size}",
					press: () => {
						void runShow(
							[MessageAction.Yes, MessageAction.No],
							MessageAction.Yes,
						);
					},
				}),
				"Question-style dialog with Yes (emphasized) and No.",
			),
			describedButton(
				new Button({
					text: "show (Ok / Cancel)",
					size: "{json>/size}",
					press: () => {
						void runShow(
							[MessageAction.Ok, MessageAction.Cancel],
							MessageAction.Ok,
						);
					},
				}),
				"Classic Ok/Cancel decision, Ok emphasized.",
			),
			describedButton(
				new Button({
					text: "show (Retry / Ignore / Abort)",
					size: "{json>/size}",
					press: () => {
						void runShow(
							[MessageAction.Retry, MessageAction.Ignore, MessageAction.Abort],
							MessageAction.Retry,
						);
					},
				}),
				"Three actions, e.g. for recoverable errors; Retry emphasized.",
			),
			describedButton(
				new Button({
					text: "show (Delete / Cancel)",
					size: "{json>/size}",
					press: () => {
						void runShow(
							[MessageAction.Delete, MessageAction.Cancel],
							MessageAction.Delete,
						);
					},
				}),
				"Destructive action confirmation; Delete emphasized.",
			),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom")
		.addStyleClass("touchControlsCardRow"),
});

const otherCard = new Card({
	header: new Header({
		title: "Other QuickDialog Methods",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			describedButton(
				new Button({
					text: "confirm",
					size: "{json>/size}",
					press: () => {
						QuickDialog.confirm({
							...getBaseOptions(),
							message: model.getProperty("/message") as string,
						})
							.then((confirmed) => {
								setResult(`confirm → ${String(confirmed)}`);
							})
							.catch(() => {
								setResult("confirm → rejected (escape)");
							});
					},
				}),
				"Yes/No confirmation that resolves to a boolean.",
			),
			describedButton(
				new Button({
					text: "input",
					size: "{json>/size}",
					press: () => {
						QuickDialog.input({
							...getBaseOptions(),
							label: "Your name",
							placeholder: "Enter a value…",
							value: "",
							actions: [MessageAction.Ok, MessageAction.Cancel],
							emphasizedAction: MessageAction.Ok,
						})
							.then((result) => {
								setResult(
									`input → ${actionLabel(result.action)}: "${result.value}"`,
								);
							})
							.catch(() => {
								setResult("input → rejected (escape)");
							});
					},
				}),
				"Prompts for a text value; Enter submits as Ok.",
			),
			describedButton(
				new Button({
					text: "select",
					size: "{json>/size}",
					press: () => {
						QuickDialog.select({
							...getBaseOptions(),
							label: "Favorite fruit",
							placeholder: "Choose an item…",
							selectedKey: "apple",
							items: [
								{
									key: "apple",
									text: "Apple",
									additionalText: "red",
								},
								{
									key: "banana",
									text: "Banana",
									additionalText: "yellow",
								},
								{
									key: "cherry",
									text: "Cherry",
									additionalText: "dark red",
								},
							],
							actions: [MessageAction.Ok, MessageAction.Cancel],
							emphasizedAction: MessageAction.Ok,
						})
							.then((result) => {
								setResult(
									`select → ${actionLabel(result.action)}: "${result.selectedKey}"`,
								);
							})
							.catch(() => {
								setResult("select → rejected (escape)");
							});
					},
				}),
				"ComboBox selection from a list of items; resolves with the selected key.",
			),
			describedButton(
				new Button({
					text: "error",
					size: "{json>/size}",
					press: () => {
						QuickDialog.error({
							...getBaseOptions(),
							message: model.getProperty("/message") as string,
						})
							.then((action) => {
								setResult(`error → ${actionLabel(action)}`);
							})
							.catch(() => {
								setResult("error → rejected (escape)");
							});
					},
				}),
				"Error dialog with Error state, error icon and a Close button.",
			),
			describedButton(
				new Button({
					text: "information",
					size: "{json>/size}",
					press: () => {
						QuickDialog.information({
							...getBaseOptions(),
							message: model.getProperty("/message") as string,
						})
							.then((action) => {
								setResult(`information → ${actionLabel(action)}`);
							})
							.catch(() => {
								setResult("information → rejected (escape)");
							});
					},
				}),
				"Information dialog with Information state, info icon and an Ok button.",
			),
			describedButton(
				new Button({
					text: "details",
					size: "{json>/size}",
					press: () => {
						QuickDialog.details({
							...getBaseOptions(),
							title: model.getProperty("/message") as string,
							details:
								"Error code: 500\nCorrelation ID: 8f3c2a1b-77d4-4e2e-9c55-0d6a1b2c3d4e\nTimestamp: 2026-08-07T10:15:30Z\nThe backend service did not respond within the configured timeout.",
						})
							.then((action) => {
								setResult(`details → ${actionLabel(action)}`);
							})
							.catch(() => {
								setResult("details → rejected (escape)");
							});
					},
				}),
				"Message with a 'Show details' link that reveals additional details on demand.",
			),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom")
		.addStyleClass("touchControlsCardRow"),
});

const customCard = new Card({
	header: new Header({
		title: "Custom Actions",
	}),
	layoutData: new FlexItemData({ growFactor: 1, baseSize: "0" }),
	content: new VBox({
		items: [
			describedButton(
				new Button({
					text: "show (Save / Discard)",
					size: "{json>/size}",
					press: () => {
						void runShow(["Save", "Discard"], "Save");
					},
				}),
				"Custom string actions only; Save emphasized.",
			),
			describedButton(
				new Button({
					text: "show (Publish / Save Draft / Cancel)",
					size: "{json>/size}",
					press: () => {
						void runShow(
							["Publish", "Save Draft", MessageAction.Cancel],
							"Publish",
						);
					},
				}),
				"Mix of custom string actions and a MessageAction; Publish emphasized.",
			),
			describedButton(
				new Button({
					text: "input (Rename / Cancel)",
					size: "{json>/size}",
					press: () => {
						QuickDialog.input({
							...getBaseOptions(),
							label: "New file name",
							placeholder: "Enter a name…",
							value: "report.pdf",
							actions: ["Rename", MessageAction.Cancel],
							emphasizedAction: "Rename",
						})
							.then((result) => {
								setResult(
									`input → ${actionLabel(result.action)}: "${result.value}"`,
								);
							})
							.catch(() => {
								setResult("input → rejected (escape)");
							});
					},
				}),
				"Input dialog with a custom Rename action (emphasized).",
			),
			describedButton(
				new Button({
					text: "select (Apply / Reset)",
					size: "{json>/size}",
					press: () => {
						QuickDialog.select({
							...getBaseOptions(),
							label: "Theme",
							selectedKey: "horizon",
							items: [
								{ key: "horizon", text: "Horizon" },
								{ key: "horizon_dark", text: "Horizon Dark" },
								{ key: "fiori_3", text: "Fiori 3" },
							],
							actions: ["Apply", "Reset"],
							emphasizedAction: "Apply",
						})
							.then((result) => {
								setResult(
									`select → ${actionLabel(result.action)}: "${result.selectedKey}"`,
								);
							})
							.catch(() => {
								setResult("select → rejected (escape)");
							});
					},
				}),
				"Select dialog with custom Apply/Reset actions; Apply emphasized.",
			),
		],
	})
		.addStyleClass("sapUiSmallMarginBegin")
		.addStyleClass("sapUiSmallMarginEnd")
		.addStyleClass("sapUiSmallMarginBottom")
		.addStyleClass("touchControlsCardRow"),
});

page.addItem(options);
page.addItem(
	new HBox({
		width: "100%",
		items: [showCard, otherCard, customCard],
	}).addStyleClass("touchControlsCardRow"),
);
page.addItem(
	createExampleCard(
		`
import { SizeMode } from "ui5/touch/controls/library";
import QuickDialog, { MessageAction }
	from "ui5/touch/controls/QuickDialog";

// QuickDialog is used from controller code, not from XML views:
const action = await QuickDialog.show({
	title: "Delete Item",
	message: "Do you really want to delete this item?",
	actions: [MessageAction.Delete, MessageAction.Cancel],
	emphasizedAction: MessageAction.Delete,
	size: SizeMode.XL,
});
if (action === MessageAction.Delete) {
	// ...
}
`,
		"typescript",
	),
);
page.addStyleClass("sapUiSmallMargin");

page.setModel(model, "json");

initTestPage("QuickDialog", page);
