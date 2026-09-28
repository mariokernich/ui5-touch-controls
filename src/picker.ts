import ResponsivePopover from "sap/m/ResponsivePopover";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { FlexRendertype, PlacementType } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import type Item from "sap/ui/core/Item";
import { TitleLevel } from "sap/ui/core/library";
import Device from "sap/ui/Device";
import Button from "./Button";
import Toolbar from "./Toolbar";
import { fitDialogBars } from "./fitDialogBars";
import type { SizeMode } from "./library";

/*
 * The list a Select and a ComboBox open: a popover of the library's own
 * buttons, so a row is as big as the field and can be hit with a finger. On a
 * phone the popover takes the whole screen, the way sap.m does it there, and
 * brings a bar of its own - the field it belongs to is behind it.
 */

/** how a popover of a picker is set up, beyond what all of them share */
export interface PickerPopoverSettings {
	/** the style class that tells the popover of one control from another */
	styleClass: string;
	/** what gets the focus when the popover opens */
	initialFocus?: Control;
	/** called once the popover is closed again */
	afterClose: () => void;
}

/**
 * Makes the popover of a picker and puts it into the hidden
 * <code>_popover</code> aggregation of its owner, which destroys it along
 * with itself.
 *
 * @param owner the control the popover belongs to
 * @param settings what sets this popover apart
 */
export function createPickerPopover(
	owner: Control,
	settings: PickerPopoverSettings,
): ResponsivePopover {
	const popover = new ResponsivePopover(owner.getId() + "-popover", {
		// a phone gets a dialog over the whole screen, like sap.m does, and that
		// one is closed by a bar of its own
		showHeader: Device.system.phone,
		showArrow: false,
		placement: PlacementType.VerticalPreferredBottom,
		initialFocus: settings.initialFocus,
		afterOpen: () => {
			fitDialogBars(popover);
		},
		afterClose: settings.afterClose,
	});

	popover.addStyleClass(settings.styleClass);
	owner.setAggregation("_popover", popover, true);

	return popover;
}

/**
 * Puts a new bar over a phone picker, and throws the one of the last opening
 * away - a popover keeps the header it is given until it is destroyed itself.
 *
 * The bar says what is being picked and brings the way back, both the way
 * sap.m does it: a picker that fills the screen cannot be left by tapping
 * beside it.
 *
 * @param popover the popover of the picker
 * @param title what the bar says
 * @param buttonText what the button that closes the picker says
 * @param size the size of the control the picker belongs to
 */
export function setPickerHeader(
	popover: ResponsivePopover,
	title: string,
	buttonText: string,
	size: SizeMode,
): void {
	popover.destroyCustomHeader();
	popover.setCustomHeader(
		new Toolbar({
			content: [
				new Title({ text: title, level: TitleLevel.H2 }),
				new ToolbarSpacer(),
				new Button({
					text: buttonText,
					size: size,
					press: () => {
						popover.close();
					},
				}),
			],
		}),
	);
}

/** how the rows of a picker list are made */
export interface PickerListSettings {
	/** the size of the control the list belongs to, and so of its rows */
	size: SizeMode;
	/** the item that is marked as the selected one */
	selectedItem: Item | null;
	/** what a tap on a row does */
	select: (item: Item) => void;
	/** anything a row needs besides its text, see ComboBox */
	decorate?: (button: Button, item: Item) => void;
}

/**
 * The list of a picker: one of the library's buttons per item, so the rows
 * carry the size of the control. An item that is not enabled is shown, but
 * cannot be picked.
 *
 * @param items the items to show
 * @param settings how the rows are made
 */
export function createPickerList(items: Item[], settings: PickerListSettings): VBox {
	return new VBox({
		// without Bare the flex box would wrap every row in a div of its own,
		// which the styling of the list would have to work around
		renderType: FlexRendertype.Bare,
		items: items.map((item) => {
			const button = new Button({
				text: item.getText(),
				size: settings.size,
				width: "100%",
				enabled: item.getEnabled(),
				press: () => {
					settings.select(item);
				},
			});

			button.addStyleClass("sizedPickerItem");
			if (item === settings.selectedItem) {
				button.addStyleClass("sizedPickerItemSelected");
			}
			settings.decorate?.(button, item);

			return button;
		}),
	}).addStyleClass("sizedPickerList");
}
