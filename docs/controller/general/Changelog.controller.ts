import JSONModel from "sap/ui/model/json/JSONModel";
import type { ChangeGroup, Release } from "../../model/changelog";
import { releases } from "../../model/changelog";
import { allPages } from "../../model/pages";
import BaseController from "../BaseController";

/** how many releases are shown before the rest is asked for */
const SHOWN = 3;

/** a group of entries, its heading turned into a marker */
interface GroupView extends Omit<ChangeGroup, "items"> {
	/** the entries as the markup the page renders */
	items: string[];
}

/** a release as the page shows it */
interface ReleaseView extends Omit<Release, "groups"> {
	groups: GroupView[];
	/** a release without a date is still on its way */
	unreleased: boolean;
	/** the newest one is open when the page is entered */
	expanded: boolean;
}

/**
 * Controller of the release history.
 *
 * The entries are written as plain sentences carrying two markers - `[Control]`
 * for a control and backticks for a name from the API. Both are turned into
 * markup here rather than being written into the model: the model stays
 * readable, and a link cannot go stale, because the names are checked against
 * the pages that exist.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class Changelog extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel({
			releases: releases
				.slice(0, SHOWN)
				.map((release, index) => this.toView(release, index)),
			/** whether the older releases are still behind their button */
			collapsed: releases.length > SHOWN,
			olderCount: releases.length - SHOWN,
		});
		this.getView()?.setModel(this.model, "changelog");
	}

	/** Adds the releases that were left out, and takes the button away. */
	public onShowOlder(): void {
		this.model.setProperty(
			"/releases",
			releases.map((release, index) => this.toView(release, index)),
		);
		this.model.setProperty("/collapsed", false);
	}

	private toView(release: Release, index: number): ReleaseView {
		return {
			version: release.version,
			date: release.date,
			summary: release.summary,
			unreleased: !release.date,
			// the newest release is the one worth reading, so it is the one that
			// is open when the page is entered
			expanded: index === 0,
			groups: release.groups.map((group) => ({
				kind: group.kind,
				items: group.items.map((item) => this.toMarkup(item)),
			})),
		};
	}

	/**
	 * Turns the two markers of an entry into markup.
	 *
	 * The address of a link comes from the router, not from a path written out
	 * here: not every page sits under `control/` - [QuickDialog] is a class and
	 * has its own. A `[Name]` that is no page at all is left as plain text, so
	 * a control that never got a page shows up as a word rather than as a link
	 * that leads nowhere.
	 */
	private toMarkup(item: string): string {
		return this.escape(item)
			.replace(/`([^`]+)`/g, "<code>$1</code>")
			.replace(/\[([A-Za-z]+)\]/g, (_match, name: string) => {
				const hash = allPages.some((page) => page.key === name)
					? this.getRouter().getURL(name)
					: undefined;

				if (hash === undefined) {
					return name;
				}

				// a bare "#/..." is resolved against the origin, not against the
				// page, and would land on the root of the server - so the link
				// carries the path it is written on
				const href = `${window.location.pathname}#/${hash}`;
				return `<a href="${href}" target="_self">${name}</a>`;
			});
	}

	/**
	 * The entries are prose, not markup: what looks like a tag in them is text
	 * and has to stay text.
	 */
	private escape(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}
}
