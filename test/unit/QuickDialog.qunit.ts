import type Dialog from "sap/m/Dialog";
import type Link from "sap/m/Link";
import type Text from "sap/m/Text";
import type VBox from "sap/m/VBox";
import { ButtonType } from "sap/m/library";
import Element from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import type Button from "ui5/touch/controls/Button";
import type ComboBox from "ui5/touch/controls/ComboBox";
import type Input from "ui5/touch/controls/Input";
import type OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import QuickDialog, { MessageAction } from "ui5/touch/controls/QuickDialog";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, keydown, setLanguage, waitFor } from "./helpers";

/** the dialogs there are, open or not */
function dialogs(): Dialog[] {
	return Element.registry.filter(
		(element) => element.getMetadata().getName() === "sap.m.Dialog",
	) as Dialog[];
}

/** waits for the dialog a call just opened - the newest one that is open */
async function openDialog(): Promise<Dialog> {
	let dialog: Dialog | undefined;

	await waitFor(() => {
		dialog = dialogs()
			.filter((candidate) => candidate.isOpen())
			.pop();
		return Boolean(dialog);
	}, "no dialog opened");

	return dialog as Dialog;
}

/**
 * The toolbar of actions: the footer of the dialog, or the end of its content
 * on UI5 before 1.110, where a dialog has no footer.
 */
function footer(dialog: Dialog): OverflowToolbar {
	return (
		typeof dialog.getFooter === "function"
			? dialog.getFooter()
			: dialog.getContent()[dialog.getContent().length - 1]
	) as OverflowToolbar;
}

function buttons(dialog: Dialog): Button[] {
	return footer(dialog)
		.getContent()
		.filter((control) => control.isA("ui5.touch.controls.Button")) as Button[];
}

function content(dialog: Dialog): VBox {
	return dialog.getContent()[0] as VBox;
}

async function gone(dialog: Dialog): Promise<void> {
	await waitFor(() => dialog.isDestroyed(), "the dialog was not destroyed");
}

QUnit.module("QuickDialog", {
	afterEach: () => {
		// a test that failed half way leaves its dialog open, and the next
		// one would find it instead of its own
		dialogs().forEach((dialog) => {
			dialog.destroy();
		});
		cleanUp();
	},
});

QUnit.test("show resolves with the action and destroys its dialog", async (assert) => {
	const before = dialogs().length;
	const result = QuickDialog.show({
		title: "Delete",
		message: "Really?",
		actions: [MessageAction.Delete, MessageAction.Cancel],
		emphasizedAction: MessageAction.Delete,
		buttonSize: SizeMode.XL,
	});
	const dialog = await openDialog();
	const [remove, cancel] = buttons(dialog);

	assert.strictEqual(dialog.getTitle(), "Delete");
	assert.strictEqual((content(dialog).getItems()[0] as Text).getText(), "Really?");
	assert.deepEqual([remove.getText(), cancel.getText()], ["Delete", "Cancel"]);
	assert.strictEqual(remove.getType(), ButtonType.Emphasized);
	assert.strictEqual(cancel.getType(), ButtonType.Default);
	assert.strictEqual(remove.getSize(), SizeMode.XL);

	remove.firePress();
	cancel.firePress();

	assert.strictEqual(await result, MessageAction.Delete, "the first action counts");
	await gone(dialog);
	assert.strictEqual(dialogs().length, before, "nothing is left behind");
});

QUnit.test("Escape rejects, and the dialog goes all the same", async (assert) => {
	const result = QuickDialog.show({ message: "Hello" });
	const dialog = await openDialog();

	keydown(dialog.getDomRef() as HTMLElement, "Escape");

	await result.then(
		() => assert.ok(false, "it should have been rejected"),
		(error: Error) => assert.strictEqual(error.message, "Dialog dismissed"),
	);
	await gone(dialog);
});

QUnit.test("the ready-made actions are named in the language of the app, own ones as written", async (assert) => {
	setLanguage("de");
	const result = QuickDialog.show({
		message: "Speichern?",
		actions: [MessageAction.Yes, MessageAction.No, "Later"],
		toolbarSpacer: true,
	});
	const dialog = await openDialog();

	assert.deepEqual(
		buttons(dialog).map((button) => button.getText()),
		["Ja", "Nein", "Later"],
	);
	assert.strictEqual(
		footer(dialog).getContent().length,
		5,
		"a spacer between every two of them",
	);

	buttons(dialog)[2].firePress();
	assert.strictEqual(await result, "Later");
	await gone(dialog);
});

QUnit.test("confirm is true for Yes, false for No", async (assert) => {
	const yes = QuickDialog.confirm({ message: "Leave?" });
	let dialog = await openDialog();
	assert.strictEqual(dialog.getIcon(), "sap-icon://question-mark");
	buttons(dialog)[0].firePress();
	assert.strictEqual(await yes, true);
	await gone(dialog);

	const no = QuickDialog.confirm({ message: "Leave?" });
	dialog = await openDialog();
	buttons(dialog)[1].firePress();
	assert.strictEqual(await no, false);
	await gone(dialog);
});

QUnit.test("error and information come with their state, icon and action", async (assert) => {
	const error = QuickDialog.error({ message: "Failed" });
	let dialog = await openDialog();

	assert.strictEqual(dialog.getState(), ValueState.Error);
	assert.strictEqual(dialog.getIcon(), "sap-icon://error");
	assert.deepEqual(buttons(dialog).map((button) => button.getText()), ["Close"]);
	buttons(dialog)[0].firePress();
	assert.strictEqual(await error, MessageAction.Close);
	await gone(dialog);

	const information = QuickDialog.information({ message: "Done", state: ValueState.Success });
	dialog = await openDialog();

	assert.strictEqual(dialog.getState(), ValueState.Success, "a state that was given wins");
	buttons(dialog)[0].firePress();
	assert.strictEqual(await information, MessageAction.Ok);
	await gone(dialog);
});

QUnit.test("input returns the text of its field", async (assert) => {
	const result = QuickDialog.input({
		label: "Name",
		value: "report.pdf",
		actions: ["Rename", MessageAction.Cancel],
	});
	const dialog = await openDialog();
	const [label, input] = content(dialog).getItems() as [Text, Input];

	assert.strictEqual(label.getText(), "Name");
	assert.strictEqual(input.getValue(), "report.pdf");

	input.setValue("summary.pdf");
	buttons(dialog)[0].firePress();

	assert.deepEqual(await result, { action: "Rename", value: "summary.pdf" });
	await gone(dialog);
});

QUnit.test("Enter in the field chooses the emphasized action, or the first one", async (assert) => {
	const emphasized = QuickDialog.input({
		actions: [MessageAction.Cancel, "Rename"],
		emphasizedAction: "Rename",
	});
	let dialog = await openDialog();
	let input = content(dialog).getItems()[0] as Input;

	keydown(input.getDomRef("inner") as HTMLElement, "Enter");
	assert.strictEqual((await emphasized).action, "Rename");
	await gone(dialog);

	const first = QuickDialog.input({ actions: ["Save", MessageAction.Cancel] });
	dialog = await openDialog();
	input = content(dialog).getItems()[0] as Input;

	keydown(input.getDomRef("inner") as HTMLElement, "Enter");
	assert.strictEqual((await first).action, "Save");
	await gone(dialog);
});

QUnit.test("select returns the key that is picked and shows the second values", async (assert) => {
	const result = QuickDialog.select({
		selectedKey: "b",
		items: [
			{ key: "a", text: "Apple", additionalText: "red" },
			{ key: "b", text: "Banana", additionalText: "yellow" },
		],
	});
	const dialog = await openDialog();
	const comboBox = content(dialog).getItems()[0] as ComboBox;

	assert.strictEqual(comboBox.getValue(), "Banana");
	assert.ok(comboBox.getShowSecondaryValues());

	comboBox.setSelectedKey("a");
	buttons(dialog)[0].firePress();

	assert.deepEqual(await result, { selectedKey: "a", action: MessageAction.Ok });
	await gone(dialog);
});

QUnit.test("details says its message once, and keeps the rest behind a link", async (assert) => {
	const result = QuickDialog.details({
		title: "The backend did not answer.",
		details: "Error code: 500",
		state: ValueState.Error,
	});
	const dialog = await openDialog();
	const [message, link, details] = content(dialog).getItems() as [Text, Link, Text];

	assert.notOk(dialog.getTitle(), "the header does not repeat the message");
	assert.strictEqual(message.getText(), "The backend did not answer.");
	assert.strictEqual(link.getText(), "Show details");
	assert.notOk(details.getVisible(), "the details are folded away");

	link.firePress();

	assert.ok(details.getVisible());
	assert.notOk(link.getVisible());

	buttons(dialog)[0].firePress();
	assert.strictEqual(await result, MessageAction.Ok);
	await gone(dialog);
});
