import type Event from "sap/ui/base/Event";
import type { ValueState } from "sap/ui/core/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import Box, { MessageAction } from "ui5/touch/controls/MessageBox";
import BaseController from "./BaseController";

/** one of the buttons that open a dialog */
interface DemoButton {
	/** identifies the dialog to open */
	key: string;
	text: string;
	description: string;
}

const showButtons: DemoButton[] = [
	{
		key: "ok",
		text: "show (Ok)",
		description: "Simple message dialog with a single emphasized Ok button.",
	},
	{
		key: "yesNo",
		text: "show (Yes / No)",
		description: "Question-style dialog with Yes (emphasized) and No.",
	},
	{
		key: "okCancel",
		text: "show (Ok / Cancel)",
		description: "Classic Ok/Cancel decision, Ok emphasized.",
	},
	{
		key: "retry",
		text: "show (Retry / Ignore / Abort)",
		description:
			"Three actions, e.g. for recoverable errors; Retry emphasized.",
	},
	{
		key: "delete",
		text: "show (Delete / Cancel)",
		description: "Destructive action confirmation; Delete emphasized.",
	},
];

const otherButtons: DemoButton[] = [
	{
		key: "confirm",
		text: "confirm",
		description: "Yes/No confirmation that resolves to a boolean.",
	},
	{
		key: "input",
		text: "input",
		description: "Prompts for a text value; Enter submits as Ok.",
	},
	{
		key: "select",
		text: "select",
		description:
			"ComboBox selection from a list of items; resolves with the selected key.",
	},
	{
		key: "error",
		text: "error",
		description: "Error dialog with Error state, error icon and a Close button.",
	},
	{
		key: "information",
		text: "information",
		description:
			"Information dialog with Information state, info icon and an Ok button.",
	},
	{
		key: "details",
		text: "details",
		description:
			"Message with a 'Show details' link that reveals additional details on demand.",
	},
];

const customButtons: DemoButton[] = [
	{
		key: "saveDiscard",
		text: "show (Save / Discard)",
		description: "Custom string actions only; Save emphasized.",
	},
	{
		key: "publish",
		text: "show (Publish / Save Draft / Cancel)",
		description:
			"Mix of custom string actions and a MessageAction; Publish emphasized.",
	},
	{
		key: "rename",
		text: "input (Rename / Cancel)",
		description: "Input dialog with a custom Rename action (emphasized).",
	},
	{
		key: "theme",
		text: "select (Apply / Reset)",
		description:
			"Select dialog with custom Apply/Reset actions; Apply emphasized.",
	},
];

/**
 * Controller of the MessageBox page. Every button opens one of the dialogs
 * and writes what it resolved with into the "Last result" strip.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class MessageBox extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				title: "MessageBox",
				message: "This is a MessageBox message.",
				size: SizeMode.L,
				state: "None",
				toolbarSpacer: false,
				lastResult: "—",
				showButtons: showButtons,
				otherButtons: otherButtons,
				customButtons: customButtons,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(
			`
import { SizeMode } from "ui5/touch/controls/library";
import MessageBox, { MessageAction }
	from "ui5/touch/controls/MessageBox";

// MessageBox is used from controller code, not from XML views:
const action = await QuickBox.show({
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
	 * Opens the dialog the pressed button stands for.
	 */
	public onDemoPress(event: Event<object, SizedButton>): void {
		const button = event.getSource().getBindingContext("json")
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
				void this.runInput("Your name", "Enter a value…", "", [
					MessageAction.Ok,
					MessageAction.Cancel,
				], MessageAction.Ok);
				break;
			case "rename":
				void this.runInput(
					"New file name",
					"Enter a name…",
					"report.pdf",
					["Rename", MessageAction.Cancel],
					"Rename",
				);
				break;
			case "select":
				void this.runSelect(
					"Favorite fruit",
					"apple",
					[
						{ key: "apple", text: "Apple", additionalText: "red" },
						{ key: "banana", text: "Banana", additionalText: "yellow" },
						{ key: "cherry", text: "Cherry", additionalText: "dark red" },
					],
					[MessageAction.Ok, MessageAction.Cancel],
					MessageAction.Ok,
				);
				break;
			case "theme":
				void this.runSelect(
					"Theme",
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
			const action = await Box.show({
				...this.getBaseOptions(),
				message: this.getMessage(),
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(`show → ${MessageBox.label(action)}`);
		} catch {
			this.setResult("show → rejected (escape)");
		}
	}

	private async runConfirm(): Promise<void> {
		try {
			const confirmed = await Box.confirm({
				...this.getBaseOptions(),
				message: this.getMessage(),
			});
			this.setResult(`confirm → ${String(confirmed)}`);
		} catch {
			this.setResult("confirm → rejected (escape)");
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
			const result = await Box.input({
				...this.getBaseOptions(),
				label: label,
				placeholder: placeholder,
				value: value,
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(
				`input → ${MessageBox.label(result.action)}: "${result.value}"`,
			);
		} catch {
			this.setResult("input → rejected (escape)");
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
			const result = await Box.select({
				...this.getBaseOptions(),
				label: label,
				placeholder: "Choose an item…",
				selectedKey: selectedKey,
				items: items,
				actions: actions,
				emphasizedAction: emphasized,
			});
			this.setResult(
				`select → ${MessageBox.label(result.action)}: "${result.selectedKey}"`,
			);
		} catch {
			this.setResult("select → rejected (escape)");
		}
	}

	private async runMessage(kind: "error" | "information"): Promise<void> {
		try {
			const action = await Box[kind]({
				...this.getBaseOptions(),
				message: this.getMessage(),
			});
			this.setResult(`${kind} → ${MessageBox.label(action)}`);
		} catch {
			this.setResult(`${kind} → rejected (escape)`);
		}
	}

	private async runDetails(): Promise<void> {
		try {
			const action = await Box.details({
				...this.getBaseOptions(),
				title: this.getMessage(),
				details:
					"Error code: 500\nCorrelation ID: 8f3c2a1b-77d4-4e2e-9c55-0d6a1b2c3d4e\nTimestamp: 2026-08-07T10:15:30Z\nThe backend service did not respond within the configured timeout.",
			});
			this.setResult(`details → ${MessageBox.label(action)}`);
		} catch {
			this.setResult("details → rejected (escape)");
		}
	}
}
