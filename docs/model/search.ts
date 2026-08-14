/**
 * What the search in the header looks through.
 *
 * Every page of the demo is one entry. A control page is found by more than
 * its name: the sap.m control it steps in for is in there, so that typing
 * <code>sap.m.Select</code> leads to the touch Select, and so is the sentence
 * that says what the control is, so that "barcode" or "signature" find their
 * page without knowing what it is called.
 *
 * The sentences are translated, so the index is built with the texts of the
 * language that is set and has to be built again when it changes.
 */
import { getControlDoc, NEW_CONTROL } from "./documentation";
import { allPages } from "./pages";

/** what the suggestion list shows, and where it leads */
export interface SearchHit {
	/** route name of the page, which is where picking the entry goes */
	key: string;
	/** name of the page, as the navigation writes it */
	text: string;
	/** the line under the name: the sap.m original, or the group */
	description: string;
	icon: string;
}

/** a hit with everything it can be found by */
interface SearchEntry extends SearchHit {
	/** name, original and summary in one lower-case string */
	terms: string;
}

/** how many suggestions the field offers at most */
export const SUGGESTION_LIMIT = 8;

/**
 * Builds the index in the language the demo is set to.
 *
 * @param getText the resource bundle of the demo, as a function
 */
export function buildSearchIndex(
	getText: (key: string) => string,
): SearchEntry[] {
	return allPages.map((page) => {
		const doc = getControlDoc(page.key);
		const text = page.textKey ? getText(page.textKey) : page.text;

		// What is worth reading under the name differs: for a rebuild it is the
		// sap.m control it replaces, which is what somebody coming from sap.m
		// searches for. A control that has no original is named by its group
		// instead, and an introductory page needs no second line at all.
		let description = "";
		if (doc?.isClass) {
			description = getText("groupClasses");
		} else if (doc && doc.replaces !== NEW_CONTROL) {
			description = doc.replaces;
		} else if (doc) {
			description = getText("groupAdditional");
		}

		return {
			key: page.key,
			text: text,
			description: description,
			icon: page.icon,
			terms: [page.key, text, description, doc ? getText(doc.summaryKey) : ""]
				.join(" ")
				.toLowerCase(),
		};
	});
}

/**
 * The pages that match what was typed, best first.
 *
 * @param index what {@link buildSearchIndex} returned
 * @param query what the visitor typed
 * @param limit how many hits to return at most
 */
export function findPages(
	index: SearchEntry[],
	query: string,
	limit = SUGGESTION_LIMIT,
): SearchHit[] {
	const wanted = query.trim().toLowerCase();

	if (!wanted) {
		return [];
	}

	return index
		.map((entry) => ({ entry, score: score(entry, wanted) }))
		.filter((hit) => hit.score > 0)
		.sort(
			(a, b) => b.score - a.score || a.entry.text.localeCompare(b.entry.text),
		)
		.slice(0, limit)
		// what a hit is found by is of no interest to whoever shows it
		.map(({ entry }) => ({
			key: entry.key,
			text: entry.text,
			description: entry.description,
			icon: entry.icon,
		}));
}

/**
 * How well an entry answers the query. The name of the page counts for most:
 * somebody who types "sel" is after the Select, not after every page whose
 * description happens to carry those three letters.
 */
function score(entry: SearchEntry, query: string): number {
	const key = entry.key.toLowerCase();

	if (key === query) {
		return 100;
	}
	if (key.startsWith(query)) {
		return 80;
	}
	if (key.includes(query)) {
		return 60;
	}
	if (entry.description.toLowerCase().includes(query)) {
		return 40;
	}

	// Every word has to turn up somewhere, in any order, so that "keyboard
	// digits" finds the NumberPad even though neither word is its name.
	const words = query.split(/\s+/).filter(Boolean);

	return words.every((word) => entry.terms.includes(word)) ? 20 : 0;
}
