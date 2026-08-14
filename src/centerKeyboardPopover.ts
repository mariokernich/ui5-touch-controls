import type Control from "sap/ui/core/Control";
import type Popover from "sap/m/Popover";

/**
 * Puts the popover that carries a keyboard in the middle of its field.
 *
 * A popover is placed at the start of what it was opened by, and a keyboard is
 * usually narrower than the field it belongs to - so it ends up hanging off to
 * one side. Centred it looks like it belongs to the field.
 *
 * The width of the popover is only known once it is open, which is why this
 * runs afterwards: an offset set on an open popover moves it right away.
 *
 * @param field the field the keyboard belongs to
 * @param popover the popover carrying the keyboard
 */
export function centerKeyboardPopover(field: Control, popover: Popover): void {
	const fieldDom = field.getDomRef();
	const popoverDom = popover.getDomRef();

	if (!fieldDom || !popoverDom) {
		return;
	}

	const offset = Math.round(
		(fieldDom.getBoundingClientRect().width -
			popoverDom.getBoundingClientRect().width) /
			2,
	);

	// a popover wider than its field stays where it is, and an offset that is
	// already right is not set again - setting it moves the popover, which
	// would bring us back here
	if (offset > 1 && popover.getOffsetX() !== offset) {
		popover.setOffsetX(offset);
	}
}
