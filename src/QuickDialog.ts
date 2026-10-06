import Dialog from "sap/m/Dialog";
import Link from "sap/m/Link";
import Text from "sap/m/Text";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { ButtonType } from "sap/m/library";
import ManagedObject from "sap/ui/base/ManagedObject";
import type Control from "sap/ui/core/Control";
import { ValueState } from "sap/ui/core/library";
import ListItem from "sap/ui/core/ListItem";
import Button from "./Button";
import ComboBox from "./ComboBox";
import Input from "./Input";
import OverflowToolbar from "./OverflowToolbar";
import { dialogHasFooter } from "./compat";
import { getText } from "./i18n";
import { SizeMode } from "./library";

export interface IQuickDialogOptions {
	/** the buttons of the dialog, in their order - <code>[Ok]</code> by default */
	actions?: Array<MessageAction | string>;
	/** the title of the dialog */
	title?: string;
	contentWidth?: string;
	contentHeight?: string;
	/** an icon beside the title */
	icon?: string;
	draggable?: boolean;
	/** the value state, which colours the header of the dialog */
	state?: ValueState;
	/** spreads the buttons apart instead of grouping them */
	toolbarSpacer?: boolean;
	/** the action whose button is emphasized */
	emphasizedAction?: MessageAction | string;
	/** the size of the buttons - <code>M</code> by default */
	buttonSize?: SizeMode;
}

export enum MessageAction {
	Abort,
	Cancel,
	Close,
	Delete,
	Ignore,
	No,
	Ok,
	Retry,
	Yes,
}

/**
 * What an action says on its button.
 *
 * One of the ready-made actions is named by the library, so it is named in
 * the language the application runs in; the name of the enumeration entry is
 * what finds the text. A string action is a text the application wrote itself
 * and is used as it stands - what it should say is not for the library to
 * decide.
 */
function actionText(action: MessageAction | string): string {
	return typeof action === "string"
		? action
		: getText(`QUICKDIALOG_${MessageAction[action].toUpperCase()}`);
}

/** the actions of a dialog that was not given any */
const DEFAULT_ACTIONS: Array<MessageAction | string> = [MessageAction.Ok];

/**
 * Ready-made dialogs for touch devices, opened from code - the counterpart of
 * <code>sap.m.MessageBox</code>, with the library's own buttons in the footer
 * so they can be hit with a finger.
 *
 * Every method returns a promise that is resolved with what the user chose,
 * and rejected when the dialog is dismissed with <kbd>Escape</kbd>. The dialog
 * is destroyed once it has closed.
 *
 * @namespace ui5.touch.controls
 */
export default class QuickDialog extends ManagedObject {
	/**
	 * Shows a message with the given actions.
	 *
	 * @returns the action the user chose
	 */
	static show(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		return QuickDialog.open(options, [new Text({ text: options.message })], {
			result: (action) => action,
		});
	}

	/**
	 * Asks for a text. <kbd>Enter</kbd> in the field chooses the emphasized
	 * action, or the first one where none is emphasized.
	 *
	 * @returns the action the user chose and the text of the field
	 */
	static input(
		options: {
			label?: string;
			placeholder?: string;
			value?: string;
			inputSize?: SizeMode;
		} & IQuickDialogOptions,
	): Promise<{
		action: MessageAction | string;
		value: string;
	}> {
		const input = new Input({
			value: options.value,
			placeholder: options.placeholder,
			size: options.inputSize ?? SizeMode.M,
			width: "100%",
		});

		return QuickDialog.open(
			options,
			[...QuickDialog.createLabel(options.label), input],
			{
				result: (action) => ({ action: action, value: input.getValue() }),
				setUp: (dialog, choose) => {
					dialog.setInitialFocus(input);
					input.attachSubmit(() => {
						choose(QuickDialog.getDefaultAction(options));
					});
				},
			},
		);
	}

	/**
	 * Asks to pick one of the given items - or to type something else, the
	 * field being a {@link ui5.touch.controls.ComboBox}. The
	 * <code>additionalText</code> of an item is shown at the end of its row.
	 *
	 * @returns the action the user chose and the key of the item that is
	 *   picked, empty for anything else
	 */
	static select(
		options: {
			label?: string;
			placeholder?: string;
			selectedKey?: string;
			items: { key: string; text: string; additionalText?: string }[];
			selectSize?: SizeMode;
		} & IQuickDialogOptions,
	): Promise<{
		selectedKey: string;
		action: MessageAction | string;
	}> {
		const comboBox = new ComboBox({
			selectedKey: options.selectedKey,
			placeholder: options.placeholder,
			items: options.items.map(
				(item) =>
					new ListItem({
						key: item.key,
						text: item.text,
						additionalText: item.additionalText,
					}),
			),
			width: "100%",
			showSecondaryValues: true,
			size: options.selectSize,
		});

		return QuickDialog.open(
			options,
			[...QuickDialog.createLabel(options.label), comboBox],
			{
				result: (action) => ({
					selectedKey: comboBox.getSelectedKey(),
					action: action,
				}),
			},
		);
	}

	/**
	 * Shows an error. Defaults to an error value state, an error icon and a
	 * single Close action.
	 *
	 * @returns the action the user chose
	 */
	static error(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		return QuickDialog.show({
			icon: "sap-icon://error",
			...options,
			state: options.state ?? ValueState.Error,
			actions: options.actions ?? [MessageAction.Close],
		});
	}

	/**
	 * Shows an information dialog. Defaults to an information value state,
	 * an information icon and a single Ok action.
	 *
	 * @returns the action the user chose
	 */
	static information(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		return QuickDialog.show({
			icon: "sap-icon://information",
			...options,
			state: options.state ?? ValueState.Information,
			actions: options.actions ?? [MessageAction.Ok],
		});
	}

	/**
	 * Shows a confirmation dialog. Defaults to Yes/No actions with Yes
	 * emphasized and a question mark icon.
	 *
	 * @returns true if the user confirmed (Yes/Ok), false otherwise
	 */
	static async confirm(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<boolean> {
		const action = await QuickDialog.show({
			icon: "sap-icon://question-mark",
			...options,
			actions: options.actions ?? [MessageAction.Yes, MessageAction.No],
			emphasizedAction: options.emphasizedAction ?? MessageAction.Yes,
		});

		return action === MessageAction.Yes || action === MessageAction.Ok;
	}

	/**
	 * Shows a short message with a link that folds a longer text open.
	 *
	 * The <code>title</code> is the short message here: it is what the dialog
	 * says, so it is not repeated in the header of the dialog.
	 *
	 * @returns the action the user chose
	 */
	static details(
		options: {
			title: string;
			details: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		const link = new Link({
			text: getText("QUICKDIALOG_SHOW_DETAILS"),
		});
		const detailsText = new Text({
			text: options.details,
			visible: false,
		});

		link.attachPress(() => {
			detailsText.setVisible(true);
			link.setVisible(false);
		});

		return QuickDialog.open(
			{ ...options, title: undefined },
			[
				new Text({ text: options.title }).addStyleClass("sapUiSmallMarginBottom"),
				link,
				detailsText,
			],
			{ result: (action) => action },
		);
	}

	/**
	 * Opens a dialog with the given content and the actions as buttons in its
	 * footer.
	 *
	 * The promise is settled once, by the first action that is chosen - a
	 * second tap before the dialog has finished closing changes nothing - and
	 * the dialog is destroyed after it has closed.
	 *
	 * @param options what all dialogs have in common
	 * @param content what the dialog shows
	 * @param handling what a chosen action resolves to, and what the dialog
	 *   needs besides
	 */
	private static open<T>(
		options: IQuickDialogOptions,
		content: Control[],
		handling: {
			result: (action: MessageAction | string) => T;
			setUp?: (dialog: Dialog, choose: (action: MessageAction | string) => void) => void;
		},
	): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			let settled = false;

			const dialog = new Dialog({
				title: options.title,
				contentWidth: options.contentWidth,
				contentHeight: options.contentHeight,
				icon: options.icon,
				draggable: options.draggable,
				state: options.state,
				content: [new VBox({ items: content })],
				afterClose: () => {
					dialog.destroy();
				},
			}).addStyleClass("sapUiContentPadding");

			const choose = (action: MessageAction | string): void => {
				if (settled) {
					return;
				}
				settled = true;
				// read before the dialog goes, the result may come from its
				// content
				const result = handling.result(action);
				dialog.close();
				resolve(result);
			};

			const footer = QuickDialog.createFooter(options, choose);
			if (dialogHasFooter(dialog)) {
				dialog.setFooter(footer);
			} else {
				// UI5 before 1.110: the dialog has no footer aggregation, and
				// its buttons aggregation would squeeze touch-sized buttons
				// into a bar of the standard height - the toolbar goes at the
				// end of the content instead
				dialog.addContent(footer.addStyleClass("sizedQuickDialogContentFooter"));
			}
			dialog.setEscapeHandler(() => {
				if (settled) {
					return;
				}
				settled = true;
				dialog.close();
				reject(new Error("Dialog dismissed"));
			});
			handling.setUp?.(dialog, choose);

			dialog.open();
		});
	}

	/**
	 * The footer of a dialog: one of the library's buttons per action.
	 */
	private static createFooter(
		options: IQuickDialogOptions,
		choose: (action: MessageAction | string) => void,
	): OverflowToolbar {
		const actions = options.actions ?? DEFAULT_ACTIONS;
		const toolbar = new OverflowToolbar({ size: options.buttonSize });

		actions.forEach((action, index) => {
			toolbar.addContent(
				new Button({
					text: actionText(action),
					type:
						options.emphasizedAction === action
							? ButtonType.Emphasized
							: ButtonType.Default,
					size: options.buttonSize,
					press: () => {
						choose(action);
					},
				}),
			);

			if (options.toolbarSpacer && index < actions.length - 1) {
				toolbar.addContent(new ToolbarSpacer());
			}
		});

		return toolbar;
	}

	/** the label over the field of a dialog, if it has one */
	private static createLabel(label?: string): Control[] {
		return label ? [new Text({ text: label })] : [];
	}

	/**
	 * The action <kbd>Enter</kbd> stands for: the emphasized one, or the
	 * first one where none is emphasized.
	 */
	private static getDefaultAction(options: IQuickDialogOptions): MessageAction | string {
		return options.emphasizedAction ?? (options.actions ?? DEFAULT_ACTIONS)[0];
	}
}
