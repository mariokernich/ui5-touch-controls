import ComboBox from "ui5/touch/controls/ComboBox";
import Dialog from "sap/m/Dialog";
import Input from "ui5/touch/controls/Input";
import { ButtonType } from "sap/m/library";
import Text from "sap/m/Text";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import ManagedObject from "sap/ui/base/ManagedObject";
import { ValueState } from "sap/ui/core/library";
import ListItem from "sap/ui/core/ListItem";
import { SizeMode } from "ui5/touch/controls/library";
import Button from "ui5/touch/controls/Button";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import Link from "sap/m/Link";

export interface IQuickDialogOptions {
	actions?: Array<MessageAction | string>;
	title?: string;
	contentWidth?: string;
	contentHeight?: string;
	icon?: string;
	draggable?: boolean;
	state?: ValueState;
	toolbarSpacer?: boolean;
	emphasizedAction?: MessageAction | string;
	buttonSize: SizeMode;
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
 * @namespace ui5.touch.controls.touch
 */
export default class QuickDialog extends ManagedObject {
	static async show(
		options: {
			message: string;
		} & IQuickDialogOptions,
	) {
		const dialog = this.getDialog(options);

		dialog.addContent(
			new VBox({
				items: [
					new Text({
						text: options.message,
					}),
				],
			}),
		);
		const actions = options.actions ?? [MessageAction.Ok];

		return new Promise<MessageAction | string>((resolve, reject) => {
			const toolbar = new OverflowToolbar({
				size: options.buttonSize,
			});

			actions.forEach((action) => {
				const btn = new Button({
					text: typeof action === "string" ? action : MessageAction[action],
					press: () => {
						dialog.close();
						resolve(action);
					},
					type:
						options.emphasizedAction === action
							? ButtonType.Emphasized
							: ButtonType.Default,
					size: options.buttonSize,
				});

				toolbar.addContent(btn);
				if (options.toolbarSpacer && action !== actions[actions.length - 1]) {
					toolbar.addContent(new ToolbarSpacer());
				}
			});
			dialog.setFooter(toolbar);
			dialog.setEscapeHandler(() => {
				dialog.close();
				reject(new Error("Dialog dismissed"));
			});
			dialog.open();
		});
	}

	static async input(
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
		return new Promise<{ action: MessageAction | string; value: string }>(
			(resolve, reject) => {
				const dialog = this.getDialog(options);
				const vbox = new VBox();

				dialog.addContent(vbox);
				if (options.label) {
					vbox.addItem(new Text({ text: options.label }));
				}

				const input = new Input({
					value: options.value,
					placeholder: options.placeholder,
					size: options.inputSize ?? SizeMode.M,
					width: "100%",
				});

				vbox.addItem(input);
				const actions = options.actions ?? [MessageAction.Ok];
				const toolbar = new OverflowToolbar({
					size: options.buttonSize,
				});

				actions.forEach((action) => {
					const btn = new Button({
						text: typeof action === "string" ? action : MessageAction[action],
						press: () => {
							dialog.close();
							resolve({
								action: action,
								value: input.getValue(),
							});
						},
						type:
							options.emphasizedAction === action
								? ButtonType.Emphasized
								: ButtonType.Default,
						size: options.buttonSize,
					});

					toolbar.addContent(btn);
					if (options.toolbarSpacer && action !== actions[actions.length - 1]) {
						toolbar.addContent(new ToolbarSpacer());
					}
				});
				dialog.setFooter(toolbar);
				dialog.setEscapeHandler(() => {
					dialog.close();
					reject(new Error("Dialog dismissed"));
				});
				dialog.setInitialFocus(input);
				input.attachSubmit(() => {
					dialog.close();
					resolve({
						action: MessageAction.Ok,
						value: input.getValue(),
					});
				});
				dialog.open();
			},
		);
	}

	static async select(
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
		return new Promise<{
			selectedKey: string;
			action: MessageAction | string;
		}>((resolve, reject) => {
			const dialog = this.getDialog(options);
			const vbox = new VBox();

			dialog.addContent(vbox);
			if (options.label) {
				vbox.addItem(new Text({ text: options.label }));
			}

			const combobox = new ComboBox({
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
				//showSecondaryValues: true,
				size: options.selectSize,
			});

			vbox.addItem(combobox);
			const actions = options.actions ?? [MessageAction.Ok];
			const toolbar = new OverflowToolbar({
				size: options.buttonSize,
			});

			actions.forEach((action) => {
				const btn = new Button({
					text: typeof action === "string" ? action : MessageAction[action],
					press: () => {
						dialog.close();
						resolve({
							selectedKey: combobox.getSelectedKey(),
							action: action,
						});
					},
					type:
						options.emphasizedAction === action
							? ButtonType.Emphasized
							: ButtonType.Default,
					size: options.buttonSize,
				});

				toolbar.addContent(btn);
				if (options.toolbarSpacer && action !== actions[actions.length - 1]) {
					toolbar.addContent(new ToolbarSpacer());
				}
			});
			dialog.setFooter(toolbar);
			dialog.setEscapeHandler(() => {
				dialog.close();
				reject(new Error("Dialog dismissed"));
			});
			dialog.open();
		});
	}

	static async error(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		return this.show({
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
	static async information(
		options: {
			message: string;
		} & IQuickDialogOptions,
	): Promise<MessageAction | string> {
		return this.show({
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
		const action = await this.show({
			icon: "sap-icon://question-mark",
			...options,
			actions: options.actions ?? [MessageAction.Yes, MessageAction.No],
			emphasizedAction: options.emphasizedAction ?? MessageAction.Yes,
		});

		return action === MessageAction.Yes || action === MessageAction.Ok;
	}

	static async details(
		options: {
			title: string;
			details: string;
		} & IQuickDialogOptions,
	) {
		const dialog = this.getDialog(options);

		const link = new Link({
			text: "Show details",
		});

		const detailsText = new Text({
			text: options.details,
			visible: false,
		});

		link.attachPress(() => {
			detailsText.setVisible(true);
			link.setVisible(false);
		});

		dialog.addContent(
			new VBox({
				items: [
					new Text({
						text: options.title,
					}).addStyleClass("sapUiSmallMarginBottom"),
					link,
					detailsText,
				],
			}),
		);
		const actions = options.actions ?? [MessageAction.Ok];

		return new Promise<MessageAction | string>((resolve, reject) => {
			const toolbar = new OverflowToolbar({
				size: options.buttonSize,
			});

			actions.forEach((action) => {
				const btn = new Button({
					text: typeof action === "string" ? action : MessageAction[action],
					press: () => {
						dialog.close();
						resolve(action);
					},
					type:
						options.emphasizedAction === action
							? ButtonType.Emphasized
							: ButtonType.Default,
					size: options.buttonSize,
				});

				toolbar.addContent(btn);
				if (options.toolbarSpacer && action !== actions[actions.length - 1]) {
					toolbar.addContent(new ToolbarSpacer());
				}
			});
			dialog.setFooter(toolbar);
			dialog.setEscapeHandler(() => {
				dialog.close();
				reject(new Error("Dialog dismissed"));
			});
			dialog.open();
		});
	}

	private static getDialog(options: IQuickDialogOptions) {
		return new Dialog({
			title: options.title,
			contentWidth: options.contentWidth,
			contentHeight: options.contentHeight,
			icon: options.icon,
			draggable: options.draggable,
			state: options.state,
		}).addStyleClass("sapUiContentPadding");
	}
}
