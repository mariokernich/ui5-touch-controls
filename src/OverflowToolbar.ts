import ToolbarBase from "sap/m/Toolbar";
import Control from "sap/ui/core/Control";
import Popover from "sap/m/Popover";
import RenderManager from "sap/ui/core/RenderManager";
import ResizeHandler from "sap/ui/core/ResizeHandler";
import Device from "sap/ui/Device";
import { MetadataOptions } from "sap/ui/core/Element";
import {
	ButtonType,
	OverflowToolbarPriority,
	PlacementType,
} from "sap/m/library";
import type OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import Button from "./Button";
import { ISized, SizeMode } from "./library";

/**
 * A simplified variant of <code>sap.m.OverflowToolbar</code> for touch devices.
 *
 * Content that does not fit into the available width is moved into an overflow
 * area: the toolbar then shows a button with three dots which opens a popover
 * containing the remaining content. The popover shows the very same control
 * instances - they are moved into the popover while it is open and moved back
 * into the toolbar afterwards, so their state and event handlers stay intact.
 *
 * Compared to <code>sap.m.OverflowToolbar</code> the following simplifications
 * apply:
 * <ul>
 * <li>content is never shrunk, it either fits or it overflows</li>
 * <li>because of that, content with priority <code>NeverOverflow</code> is
 * moved to the overflow area as a last resort when it does not fit at all -
 * the standard control shrinks it instead</li>
 * <li><code>sap.m.ToolbarSpacer</code> always stays in the toolbar and is not
 * taken into account when calculating the required width</li>
 * <li>only the priorities of <code>sap.m.OverflowToolbarLayoutData</code> are
 * evaluated, the <code>sap.m.IOverflowToolbarContent</code> interface is not</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class OverflowToolbar extends ToolbarBase implements ISized {
	/**
	 * Rounding differences between the measured content and the measured
	 * toolbar must not trigger an overflow, therefore a small tolerance is
	 * applied when the two are compared.
	 */
	private static readonly WIDTH_TOLERANCE = 1;

	/**
	 * Safety net against endless re-rendering: a toolbar whose own width
	 * depends on its content can change its width with every recalculation.
	 * After this number of consecutive layout changes the current result is
	 * kept.
	 */
	private static readonly MAX_LAYOUT_RUNS = 5;

	/**
	 * Priority used for content without overflow layout data - the same
	 * default the standard control uses.
	 */
	private static readonly DEFAULT_PRIORITY_ORDER = 3;

	/**
	 * Order in which content is moved to the overflow area - the lower the
	 * value, the earlier the control overflows.
	 */
	private static readonly PRIORITY_ORDER: Record<string, number> = {
		[OverflowToolbarPriority.Disappear]: 1,
		[OverflowToolbarPriority.Low]: 2,
		[OverflowToolbarPriority.High]: 3,
	};

	/**
	 * Last measured width of every content control, keyed by control id.
	 * Overflowing content is not rendered inside the toolbar and can therefore
	 * not be measured - the cached width is used instead to decide whether it
	 * fits in again.
	 */
	private contentWidths: Record<string, number> = {};

	/**
	 * Ids of the content controls that currently overflow.
	 */
	private overflowIds: string[] = [];

	/**
	 * Content controls that are currently placed in the popover.
	 */
	private popoverContent: Control[] = [];

	/**
	 * Content order captured before the popover took the controls over, used
	 * to move them back to their original position.
	 */
	private restoreOrder: Control[] = [];

	private popoverOpen = false;
	private resizeHandlerId: string | null = null;
	private lastAvailableWidth = -1;
	private layoutRuns = 0;

	static readonly metadata: MetadataOptions = {
		interfaces: [
			"sap.ui.core.Toolbar",
			"sap.m.IBar",
			"ui5.touch.controls.ISized",
		],
		defaultAggregation: "content",
		properties: {
			/**
			 * Touch size of the overflow button.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The content of the toolbar.
			 */
			content: {
				type: "sap.ui.core.Control",
				multiple: true,
				singularName: "content",
			},
			/**
			 * Internal button that opens the overflow popover.
			 */
			_overflowButton: {
				type: "ui5.touch.controls.Button",
				multiple: false,
				visibility: "hidden",
			},
			/**
			 * Internal popover showing the overflowing content.
			 */
			_popover: {
				type: "sap.m.Popover",
				multiple: false,
				visibility: "hidden",
			},
		},
	};

	constructor(idOrSettings?: string | $OverflowToolbarSettings);
	constructor(id?: string, settings?: $OverflowToolbarSettings);
	constructor(id?: string, settings?: $OverflowToolbarSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: OverflowToolbar) {
			rm.openStart("div", control);
			rm.class("sapMTBStandard");
			rm.class("sapMTBNewFlex");
			rm.class("sapMOTB");
			rm.class("sapMIBar");
			rm.class("sizedToolbar");
			rm.class("sizedOverflowToolbar");
			rm.openEnd();

			control.getContent().forEach(function (oControl) {
				// overflowing content is not rendered inside the toolbar, it is
				// rendered by the popover instead
				if (control.isInOverflow(oControl)) {
					return;
				}
				oControl.addStyleClass("sapMBarChild");
				rm.renderControl(oControl);
			});

			// the overflow button is always rendered so that its width is known
			// upfront; it is hidden via CSS as long as everything fits
			rm.renderControl(control.getOverflowButton());

			rm.close("div");
		},
	};

	onBeforeRendering(): void {
		const button = this.getOverflowButton();
		const size = this.getSize();

		button.setSize(size);
		button.setSidePadding("0px");
	}

	onAfterRendering(event: jQuery.Event): void {
		super.onAfterRendering(event);

		if (!this.resizeHandlerId) {
			this.resizeHandlerId = ResizeHandler.register(this, () => {
				this.handleResize();
			});
		}

		this.doLayout();
	}

	exit(): void | undefined {
		if (this.resizeHandlerId) {
			ResizeHandler.deregister(this.resizeHandlerId);
			this.resizeHandlerId = null;
		}
	}

	/**
	 * Returns whether the given control is a toolbar spacer. Wrapped in a
	 * helper so that the type guard of <code>isA</code> does not narrow the
	 * control type away at the call site.
	 */
	private static isSpacer(control: Control): boolean {
		return control.isA("sap.m.ToolbarSpacer");
	}

	/**
	 * Returns whether the given content control currently overflows and is
	 * therefore not rendered inside the toolbar.
	 */
	private isInOverflow(control: Control): boolean {
		return this.overflowIds.includes(control.getId());
	}

	private getOverflowButton(): Button {
		let button = this.getAggregation("_overflowButton") as Button | null;

		if (!button) {
			button = new Button(this.getId() + "-overflowButton", {
				icon: "sap-icon://overflow",
				type: ButtonType.Transparent,
				sidePadding: "0px",
				press: () => {
					this.openOverflow();
				},
			});
			button.addStyleClass("sizedOverflowToolbarButton");
			this.setAggregation("_overflowButton", button, true);
		}

		return button;
	}

	private getPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-popover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.Vertical,
				contentWidth: Device.system.phone ? "100%" : "auto",
				afterClose: () => {
					this.onPopoverClosed();
				},
			});
			popover.addStyleClass("sizedOverflowToolbarPopover");
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	/**
	 * Returns the outer width of the given element, margins included.
	 */
	private static getOuterWidth(dom: Element): number {
		const style = window.getComputedStyle(dom);

		return (
			dom.getBoundingClientRect().width +
			(parseFloat(style.marginLeft) || 0) +
			(parseFloat(style.marginRight) || 0)
		);
	}

	/**
	 * Returns the overflow priority of the given content control. Content
	 * without <code>sap.m.OverflowToolbarLayoutData</code> uses the default
	 * priority <code>High</code>, just like in the standard control.
	 */
	private getControlPriority(control: Control): OverflowToolbarPriority {
		const layoutData = control.getLayoutData();

		if (
			layoutData?.isA<OverflowToolbarLayoutData>(
				"sap.m.OverflowToolbarLayoutData",
			)
		) {
			return layoutData.getPriority();
		}

		return OverflowToolbarPriority.High;
	}

	/**
	 * Returns whether the given content control must always stay in the
	 * toolbar.
	 */
	private isToolbarOnly(control: Control): boolean {
		const priority = this.getControlPriority(control);

		return (
			OverflowToolbar.isSpacer(control) ||
			priority === OverflowToolbarPriority.NeverOverflow ||
			priority === OverflowToolbarPriority.Never
		);
	}

	/**
	 * Returns whether the given content control must always stay in the
	 * overflow area.
	 */
	private isPopoverOnly(control: Control): boolean {
		const priority = this.getControlPriority(control);

		return (
			priority === OverflowToolbarPriority.AlwaysOverflow ||
			priority === OverflowToolbarPriority.Always
		);
	}

	/**
	 * Returns the width the given content control needs inside the toolbar.
	 * Spacers grow and shrink with the available space, so they are ignored.
	 */
	private getContentWidth(control: Control): number {
		if (OverflowToolbar.isSpacer(control)) {
			return 0;
		}

		return this.contentWidths[control.getId()] || 0;
	}

	/**
	 * Stores the current width of every rendered content control so that it is
	 * still known once the control has been moved to the overflow area.
	 */
	private cacheContentWidths(content: Control[]): void {
		content.forEach((control) => {
			if (OverflowToolbar.isSpacer(control)) {
				return;
			}

			const dom = control.getDomRef();
			if (!dom) {
				return;
			}

			const width = OverflowToolbar.getOuterWidth(dom);
			if (width > 0) {
				this.contentWidths[control.getId()] = width;
			}
		});
	}

	/**
	 * Returns the width the overflow button occupies inside the toolbar.
	 */
	private getOverflowButtonWidth(): number {
		const dom = this.getOverflowButton().getDomRef();

		return dom ? OverflowToolbar.getOuterWidth(dom) : 0;
	}

	/**
	 * Returns the sort order of the given control: content with a lower value
	 * is moved to the overflow area first.
	 */
	private getPriorityOrder(control: Control): number {
		return (
			OverflowToolbar.PRIORITY_ORDER[this.getControlPriority(control)] ||
			OverflowToolbar.DEFAULT_PRIORITY_ORDER
		);
	}

	/**
	 * Determines which content controls do not fit into the given width.
	 *
	 * Content is moved to the overflow area from the lowest to the highest
	 * priority and, within the same priority, from right to left - the same
	 * order the standard control uses. If it still does not fit afterwards,
	 * even content marked as <code>NeverOverflow</code> is moved, because it
	 * would otherwise cover the overflow button and make the content behind it
	 * unreachable.
	 *
	 * @param content the visible content of the toolbar
	 * @param available the inner width of the toolbar in pixels
	 * @returns the overflowing controls in content order
	 */
	private calculateOverflow(content: Control[], available: number): Control[] {
		const overflow: Control[] = [];
		let required = 0;

		content.forEach((control) => {
			if (this.isPopoverOnly(control)) {
				overflow.push(control);
			} else {
				required += this.getContentWidth(control);
			}
		});

		if (
			overflow.length === 0 &&
			required <= available + OverflowToolbar.WIDTH_TOLERANCE
		) {
			return [];
		}

		// as soon as something overflows, the overflow button needs space too
		const limit =
			available -
			this.getOverflowButtonWidth() +
			OverflowToolbar.WIDTH_TOLERANCE;

		const candidates = content
			.filter(
				(control) =>
					!this.isToolbarOnly(control) && !overflow.includes(control),
			)
			.sort((a, b) => {
				const orderA = this.getPriorityOrder(a);
				const orderB = this.getPriorityOrder(b);

				if (orderA !== orderB) {
					return orderA - orderB;
				}

				// same priority: the control further to the right overflows first
				return content.indexOf(b) - content.indexOf(a);
			});

		required = this.moveUntilItFits(candidates, overflow, required, limit);

		if (required > limit) {
			// Last resort: what is left over now is the content that should
			// never overflow. It does not fit either, and keeping it would push
			// the overflow button out of the toolbar - so move it as well,
			// again from right to left.
			const toolbarOnly = content
				.filter(
					(control) =>
						!OverflowToolbar.isSpacer(control) && !overflow.includes(control),
				)
				.sort((a, b) => content.indexOf(b) - content.indexOf(a));

			this.moveUntilItFits(toolbarOnly, overflow, required, limit);
		}

		return content.filter((control) => overflow.includes(control));
	}

	/**
	 * Moves controls from the given candidates to the overflow area until the
	 * remaining content fits into the limit.
	 *
	 * @returns the width the remaining content still requires
	 */
	private moveUntilItFits(
		candidates: Control[],
		overflow: Control[],
		required: number,
		limit: number,
	): number {
		let remaining = required;

		for (const control of candidates) {
			if (remaining <= limit) {
				break;
			}
			overflow.push(control);
			remaining -= this.getContentWidth(control);
		}

		return remaining;
	}

	/**
	 * Recalculates which content fits into the toolbar and triggers a
	 * re-rendering if the result has changed.
	 */
	private doLayout(): void {
		const dom = this.getDomRef();

		if (!dom || this.popoverOpen) {
			return;
		}

		const style = window.getComputedStyle(dom);
		const available =
			dom.clientWidth -
			(parseFloat(style.paddingLeft) || 0) -
			(parseFloat(style.paddingRight) || 0);

		if (available <= 0) {
			return;
		}

		if (
			Math.abs(available - this.lastAvailableWidth) >
			OverflowToolbar.WIDTH_TOLERANCE
		) {
			this.lastAvailableWidth = available;
			this.layoutRuns = 0;
		}

		const content = this.getContent().filter((control) => control.getVisible());
		this.cacheContentWidths(content);

		const overflow = this.calculateOverflow(content, available);
		const overflowIds = overflow.map((control) => control.getId());

		const button = this.getOverflowButton();
		button.toggleStyleClass(
			"sizedOverflowToolbarButtonHidden",
			overflow.length === 0,
		);
		// without a spacer the content is packed to the left and the overflow
		// button would sit right behind the last visible control - push it to
		// the end instead, so it always stays in the same place. With a spacer
		// the app decides where the content sits, and an auto margin would
		// swallow the space the spacer needs to grow.
		button.toggleStyleClass(
			"sizedOverflowToolbarButtonEnd",
			!content.some((control) => OverflowToolbar.isSpacer(control)),
		);

		if (overflowIds.join(",") === this.overflowIds.join(",")) {
			this.layoutRuns = 0;
			return;
		}

		if (this.layoutRuns >= OverflowToolbar.MAX_LAYOUT_RUNS) {
			return;
		}

		this.layoutRuns++;
		this.overflowIds = overflowIds;
		this.invalidate();
	}

	private handleResize(): void {
		if (this.popoverOpen) {
			// the layout is recalculated as soon as the popover has handed the
			// content back to the toolbar
			this.getPopover().close();
			return;
		}

		this.doLayout();
	}

	/**
	 * Returns where the popover should open: above the toolbar if it is used as
	 * a footer, below it if it is used as a header.
	 */
	private getPopoverPlacement(): PlacementType {
		const dom = this.getDomRef();

		if (dom) {
			if (dom.closest(".sapMPageFooter, .sapMFooter-CTX")) {
				return PlacementType.Top;
			}
			if (dom.closest(".sapMPageHeader, .sapMHeader-CTX")) {
				return PlacementType.Bottom;
			}
		}

		return PlacementType.Vertical;
	}

	/**
	 * Moves the overflowing content into the popover and opens it.
	 *
	 * Content with priority <code>Disappear</code> stays hidden, exactly as in
	 * the standard control.
	 */
	private openOverflow(): void {
		const popover = this.getPopover();
		const content = this.getContent();

		this.restoreOrder = content.slice();
		this.popoverContent = content.filter(
			(control) =>
				this.isInOverflow(control) &&
				this.getControlPriority(control) !== OverflowToolbarPriority.Disappear,
		);

		this.popoverContent.forEach((control) => {
			// removing without invalidating is safe: overflowing content is not
			// rendered inside the toolbar anyway
			this.removeAggregation("content", control, true);
			control.removeStyleClass("sapMBarChild");
			control.addStyleClass("sizedOverflowToolbarPopoverChild");
			popover.addContent(control);
		});

		this.popoverOpen = true;
		popover.setPlacement(this.getPopoverPlacement());
		popover.openBy(this.getOverflowButton());
	}

	/**
	 * Moves the content of the popover back into the toolbar, restoring the
	 * original order.
	 */
	private onPopoverClosed(): void {
		const popover = this.getPopover();

		popover.removeAllContent();

		// the controls are restored from left to right, so every one of them
		// can simply be inserted at its original index again
		this.popoverContent.forEach((control) => {
			control.removeStyleClass("sizedOverflowToolbarPopoverChild");
			this.insertAggregation(
				"content",
				control,
				this.restoreOrder.indexOf(control),
				true,
			);
		});

		this.popoverContent = [];
		this.restoreOrder = [];
		this.popoverOpen = false;

		this.doLayout();
	}
}
