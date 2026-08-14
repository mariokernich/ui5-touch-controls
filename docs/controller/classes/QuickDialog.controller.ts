import type Event from "sap/ui/base/Event";
import type { ValueState } from "sap/ui/core/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import Dialog, { MessageAction } from "ui5/touch/controls/QuickDialog";
import BaseController from "../BaseController";

/** one of the buttons that open a dialog */
interface DemoButton {
	/** identifies the dialog to open */
	key: string;
	/**
	 * What the button says. This is the signature of the method it calls, e.g.
	 * <code>show (Ok)</code>, so it reads the same in every language.
	 */
	text: string;
	/** what that dialog is good for, in the language of the page */
	description: string;
}

/**
 * The buttons of the three groups. The captions are signatures and stay as
 * they are; the descriptions are looked up when the page is built, so they
 * follow the language.
 */
const showButtons: { key: string; text: string; textKey: string }[] = [
	{ key: "ok", text: "show (Ok)", textKey: "qdOk" },
	{ key: "yesNo", text: "show (Yes / No)", textKey: "qdYesNo" },
	{ key: "okCancel", text: "show (Ok / Cancel)", textKey: "qdOkCancel" },
	{
		key: "retry",
		text: "show (Retry / Ignore / Abort)",
		textKey: "qdRetry",
	},
	{ key: "delete", text: "show (Delete / Cancel)", textKey: "qdDelete" },
];

const otherButtons: { key: string; text: string; textKey: string }[] = [
	{ key: "confirm", text: "confirm", textKey: "qdConfirm" },
	{ key: "input", text: "input", textKey: "qdInput" },
	{ key: "select", text: "select", textKey: "qdSelect" },
	{ key: "error", text: "error", textKey: "qdError" },
	{
		key: "information",
		text: "information",
		textKey: "qdInformation",
	},
	{ key: "details", text: "details", textKey: "qdDetails" },
];

const customButtons: { key: string; text: string; textKey: string }[] = [
	{
		key: "saveDiscard",
		text: "show (Save / Discard)",
		textKey: "qdSaveDiscard",
	},
	{
		key: "publish",
		text: "show (Publish / Save Draft / Cancel)",
		textKey: "qdPublish",
	},
	{ key: "rename", text: "input (Rename / Cancel)", textKey: "qdRename" },
	{ key: "theme", text: "select (Apply / Reset)", textKey: "qdTheme" },
];

/**
 * Controller of the QuickDialog page. Every button opens one of the dialogs
 * and writes what it resolved with into the "Last result" strip.
 *
 * @namespace ui5.touch.controls.demo.controller.classes
 */
export default class QuickDialog extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("QuickDialog");

		this.model = new JSONModel(
			{
				title: "QuickDialog",
				message: this.getText("qdDefaultMessage"),
				size: SizeMode.L,
				state: "None",
				toolbarSpacer: false,
				lastResult: "—",
				showButtons: this.describe(showButtons),
				otherButtons: this.describe(otherButtons),
				customButtons: this.describe(customButtons),
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setSnippets({
			main: [
				{
					title: this.getText("exampleQdShow"),
					language: "typescript",
					code: `
import { SizeMode } from "ui5/touch/controls/library";
import QuickDialog, { MessageAction }
	from "ui5/touch/controls/QuickDialog";

// QuickDialog is used from controller code, not from XML views.
// Every method returns a promise that resolves with the action pressed.
const action = await QuickDialog.show({
	title: "Delete Item",
	message: "Do you really want to delete this item?",
	actions: [MessageAction.Delete, MessageAction.Cancel],
	emphasizedAction: MessageAction.Delete,
	buttonSize: SizeMode.XL,
});

if (action === MessageAction.Delete) {
	await this.deleteItem();
}
`,
				},
				{
					title: this.getText("exampleQdConfirm"),
					language: "typescript",
					code: `
// confirm resolves with a boolean instead of an action - Yes and Ok are
// true, everything else is false. Yes/No and the question mark icon are
// the defaults, so the call is one line longer than the question itself.
const confirmed = await QuickDialog.confirm({
	title: "Leave page",
	message: "There are unsaved changes. Leave anyway?",
	buttonSize: SizeMode.L,
});

if (confirmed) {
	this.getRouter().navTo("home");
}
`,
				},
				{
					title: this.getText("exampleQdInput"),
					language: "typescript",
					code: `
// input puts a tc:Input into the dialog and resolves with the action and
// the value. Enter in the field resolves as Ok, so a short value takes no
// button press at all.
const result = await QuickDialog.input({
	title: "Rename file",
	label: "New file name",
	placeholder: "Enter a name…",
	value: "report.pdf",
	actions: ["Rename", MessageAction.Cancel],
	emphasizedAction: "Rename",
	buttonSize: SizeMode.L,
	// the field may be scaled on its own, e.g. bigger than the buttons
	inputSize: SizeMode.XL,
});

if (result.action === "Rename") {
	await this.rename(result.value);
}
`,
				},
				{
					title: this.getText("exampleQdSelect"),
					language: "typescript",
					code: `
// select puts a tc:ComboBox into the dialog - its list rows are as tall as
// the field, so they can be hit with a finger. It resolves with the action
// and the key that was selected.
const result = await QuickDialog.select({
	title: "Theme",
	label: "Choose a theme",
	placeholder: "Choose an item…",
	selectedKey: "horizon",
	items: [
		{ key: "horizon", text: "Horizon", additionalText: "light" },
		{ key: "horizon_dark", text: "Horizon Dark", additionalText: "dark" },
		{ key: "fiori_3", text: "Fiori 3" },
	],
	actions: ["Apply", "Reset"],
	emphasizedAction: "Apply",
	buttonSize: SizeMode.L,
	selectSize: SizeMode.XL,
});

if (result.action === "Apply") {
	Theming.setTheme(result.selectedKey);
}
`,
				},
				{
					title: this.getText("exampleQdMessages"),
					language: "typescript",
					code: `
// error and information are show with a state, an icon and a fitting
// action already set - the message is all that is left to say
await QuickDialog.error({
	title: "Save failed",
	message: "The order could not be saved.",
	buttonSize: SizeMode.L,
});

await QuickDialog.information({
	title: "Order 4711",
	message: "The order has been released.",
	buttonSize: SizeMode.L,
});

// details keeps the long text behind a link, so the dialog stays short
// until someone asks for the rest
await QuickDialog.details({
	title: "The backend did not answer.",
	details: [
		"Error code: 500",
		"Correlation ID: 8f3c2a1b-77d4-4e2e-9c55-0d6a1b2c3d4e",
		"The service did not respond within the configured timeout.",
	].join("\\n"),
	state: ValueState.Error,
	buttonSize: SizeMode.L,
});
`,
				},
				{
					title: this.getText("exampleQdCustom"),
					language: "typescript",
					code: `
// An action is either a MessageAction, which the library names in the
// language the application runs in, or a string, which is taken as it
// stands. The two can be mixed, and the result says which one it was.
const action = await QuickDialog.show({
	title: "Publish",
	message: "How should this document be published?",
	actions: ["Publish", "Save Draft", MessageAction.Cancel],
	emphasizedAction: "Publish",
	buttonSize: SizeMode.L,
});

switch (action) {
	case "Publish":
		await this.publish();
		break;
	case "Save Draft":
		await this.saveDraft();
		break;
	case MessageAction.Cancel:
		break;
}
`,
				},
				{
					title: this.getText("exampleQdEscape"),
					language: "typescript",
					code: `
// Escape closes the dialog without an action, and the promise is rejected
// rather than resolved - a dismissed dialog is not the same as a pressed
// Cancel, and the difference is worth keeping.
try {
	const action = await QuickDialog.show({
		title: "Discard changes",
		message: "The changes will be lost.",
		actions: [MessageAction.Ok, MessageAction.Cancel],
		emphasizedAction: MessageAction.Ok,
		buttonSize: SizeMode.L,
	});

	if (action === MessageAction.Ok) {
		this.discard();
	}
} catch {
	// dismissed with Escape - nothing to do
}
`,
				},
				{
					title: this.getText("exampleQdOptions"),
					language: "typescript",
					code: `
// Every method takes the same set of options beside its own. buttonSize is
// the touch size of the footer, and the footer is a tc:OverflowToolbar -
// what does not fit moves behind the button with the three dots.
await QuickDialog.show({
	title: "Order 4711",
	message: "Release the order for production?",
	// the state colours the header bar, the icon sits beside the title
	state: ValueState.Warning,
	icon: "sap-icon://alert",
	// how big the dialog is allowed to be
	contentWidth: "30rem",
	contentHeight: "auto",
	draggable: true,
	// spreads the buttons apart instead of grouping them
	toolbarSpacer: true,
	actions: [MessageAction.Yes, MessageAction.No],
	emphasizedAction: MessageAction.Yes,
	buttonSize: SizeMode.XL,
});
`,
				},
			],
		});
	}

	/**
	 * Turns the button lists into what the view binds: the caption is taken as
	 * it is, the description is looked up in the bundle.
	 */
	private describe(
		buttons: { key: string; text: string; textKey: string }[],
	): DemoButton[] {
		return buttons.map((button) => ({
			key: button.key,
			text: button.text,
			description: this.getText(button.textKey),
		}));
	}

	/**
	 * Opens the dialog the pressed button stands for.
	 */
	public onDemoPress(event: Event<object, SizedButton>): void {
		const button = event
			.getSource()
			.getBindingContext("json")
			?.getObject() as DemoButton;

		switch (button.key) {
			case "ok":
				void this.runShow([MessageAction.Ok], MessageAction.Ok);
				break;
			case "yesNo":
				void this.runShow(
					[MessageAction.Yes, MessageAction.No],
					MessageAction.Yes,
				);
				break;
			case "okCancel":
				void this.runShow(
					[MessageAction.Ok, MessageAction.Cancel],
					MessageAction.Ok,
				);
				break;
			case "retry":
				void this.runShow(
					[MessageAction.Retry, MessageAction.Ignore, MessageAction.Abort],
					MessageAction.Retry,
				);
				break;
			case "delete":
				void this.runShow(
					[MessageAction.Delete, MessageAction.Cancel],
					MessageAction.Delete,
				);
				break;
			case "saveDiscard":
				void this.runShow(["Save", "Discard"], "Save");
				break;
			case "publish":
				void this.runShow(
					["Publish", "Save Draft", MessageAction.Cancel],
					"Publish",
				);
				break;
			case "confirm":
				void this.runConfirm();
				break;
			case "input":
				void this.runInput(
					this.getText("qdLabelName"),
					this.getText("qdPlaceholderValue"),
					"",
					[MessageAction.Ok, MessageAction.Cancel],
					MessageAction.Ok,
				);
				break;
			case "rename":
				void this.runInput(
					this.getText("qdLabelFileName"),
					this.getText("qdPlaceholderName"),
					"report.pdf",
					["Rename", MessageAction.Cancel],
					"Rename",
				);
				break;
			case "select":
				void this.runSelect(
					this.getText("qdLabelFruit"),
					"apple",
					[
						{
							key: "apple",
							text: this.getText("qdFruitApple"),
							additionalText: this.getText("qdColorRed"),
						},
						{
							key: "banana",
							text: this.getText("qdFruitBanana"),
							additionalText: this.getText("qdColorYellow"),
						},
						{
							key: "cherry",
							text: this.getText("qdFruitCherry"),
							additionalText: this.getText("qdColorDarkRed"),
						},
					],
					[MessageAction.Ok, MessageAction.Cancel],
					MessageAction.Ok,
				);
				break;
			case "theme":
				void this.runSelect(
					this.getText("qdLabelTheme"),
					"horizon",
					[
						{ key: "horizon", text: "Horizon" },
						{ key: "horizon_dark", text: "Horizon Dark" },
						{ key: "fiori_3", text: "Fiori 3" },
					],
					["Apply", "Reset"],
					"Apply",
				);
				break;
			case "error":
				void this.runMessage("error");
				break;
			case "information":
				void this.runMessage("information");
				break;
			case "details":
				void this.runDetails();
				break;
		}
	}

	/**
	 * The options every dialog is opened with, taken from the playground.
	 */
	private getBaseOptions() {
		return {
			title: this.model.getProperty("/title") as string,
			state: this.model.getProperty("/state") as ValueState,
			buttonSize: this.model.getProperty("/size") as SizeMode,
			toolbarSpacer: this.model.getProperty("/toolbarSpacer") as boolean,
		};
	}

	private getMessage(): string {
		return this.model.getProperty("/message") as string;
	}

	private setResult(result: string): void {
		this.model.setProperty("/lastResult", result);
	}

	private static label(action: MessageAction | string): string {
		return typeof action === "string" ? action : MessageAction[action];
	}

	private async runShow(
		actions: (MessageAction | string)[],
		emphasized?: MessageAction | string,
	): Promise<void> {
		try {
			const action = await Dialog.show({
				...this.getBaseOptions(),
				message: this.getMessage(),
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(`show → ${QuickDialog.label(action)}`);
		} catch {
			this.setResult(`show → ${this.getText("qdRejected")}`);
		}
	}

	private async runConfirm(): Promise<void> {
		try {
			const confirmed = await Dialog.confirm({
				...this.getBaseOptions(),
				message: this.getMessage(),
			});
			this.setResult(`confirm → ${String(confirmed)}`);
		} catch {
			this.setResult(`confirm → ${this.getText("qdRejected")}`);
		}
	}

	private async runInput(
		label: string,
		placeholder: string,
		value: string,
		actions: (MessageAction | string)[],
		emphasized: MessageAction | string,
	): Promise<void> {
		try {
			const result = await Dialog.input({
				...this.getBaseOptions(),
				label: label,
				placeholder: placeholder,
				value: value,
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(
				`input → ${QuickDialog.label(result.action)}: "${result.value}"`,
			);
		} catch {
			this.setResult(`input → ${this.getText("qdRejected")}`);
		}
	}

	private async runSelect(
		label: string,
		selectedKey: string,
		items: { key: string; text: string; additionalText?: string }[],
		actions: (MessageAction | string)[],
		emphasized: MessageAction | string,
	): Promise<void> {
		try {
			const result = await Dialog.select({
				...this.getBaseOptions(),
				label: label,
				placeholder: this.getText("qdPlaceholderItem"),
				selectedKey: selectedKey,
				items: items,
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(
				`select → ${QuickDialog.label(result.action)}: "${result.selectedKey}"`,
			);
		} catch {
			this.setResult(`select → ${this.getText("qdRejected")}`);
		}
	}

	private async runMessage(kind: "error" | "information"): Promise<void> {
		try {
			const action = await Dialog[kind]({
				...this.getBaseOptions(),
				message: this.getMessage(),
			});
			this.setResult(`${kind} → ${QuickDialog.label(action)}`);
		} catch {
			this.setResult(`${kind} → ${this.getText("qdRejected")}`);
		}
	}

	private async runDetails(): Promise<void> {
		try {
			const action = await Dialog.details({
				...this.getBaseOptions(),
				title: this.getMessage(),
				details: this.getText("qdErrorDetails"),
			});
			this.setResult(`details → ${QuickDialog.label(action)}`);
		} catch {
			this.setResult(`details → ${this.getText("qdRejected")}`);
		}
	}
}
