import ManagedObject from "sap/ui/base/ManagedObject";
import { ValueState } from "sap/ui/core/library";

export type DialogOptions = {
	title?: string;
	contentWidth?: string;
	contentHeight?: string;
	icon?: string;
	draggable?: boolean;
	state?: ValueState;
};

/**
 * @namespace ui5.touch.controls
 */
export default class Dialogs extends ManagedObject {
	public static async confirm(options?: DialogOptions) {}
	public static async message(options?: DialogOptions) {}
	public static async select(
		options: {
			items: { key: string; value: string; additionalText?: string }[];
			message?: string;
			selectedKey?: string;
			placeholder?: string;
		} & DialogOptions,
	) {}
	public static async input(
		options: {
			message?: string;
			value?: string;
			placeholder?: string;
		} & DialogOptions,
	) {}
}
