/**
 * Puts the outcome of the QUnit run on the window, where the UI tests pick it
 * up - see e2e/unit.test.js. The page itself shows QUnit's own report, this is
 * the same in a form a script can read.
 */

/** one assertion that failed, with the test it belongs to */
interface Failure {
	module: string;
	test: string;
	message: string;
	actual?: string;
	expected?: string;
	source?: string;
}

/** what the UI tests read once the run is over */
export interface QUnitOutcome {
	total: number;
	passed: number;
	failed: number;
	runtime: number;
	failures: Failure[];
}

const failures: Failure[] = [];

function describe(value: unknown): string | undefined {
	if (value === undefined) {
		return undefined;
	}

	try {
		return JSON.stringify(value);
	} catch {
		// a control, say, which refers to itself
		return Object.prototype.toString.call(value);
	}
}

QUnit.log((details) => {
	if (details.result) {
		return;
	}

	failures.push({
		module: details.module,
		test: details.name,
		message: details.message ?? "",
		actual: describe(details.actual),
		expected: describe(details.expected),
		source: details.source,
	});
});

QUnit.done((details) => {
	(window as unknown as { touchQUnitOutcome: QUnitOutcome }).touchQUnitOutcome = {
		total: details.total,
		passed: details.passed,
		failed: details.failed,
		runtime: details.runtime,
		failures: failures,
	};
});
