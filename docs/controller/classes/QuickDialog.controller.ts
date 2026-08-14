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

		this.setExample(
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
		);
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
