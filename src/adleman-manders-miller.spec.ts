import {
	adlemanMandersMiller,
	factoriseQMinus1,
} from "./adleman-manders-miller";

describe("factoriseQMinus1", () => {
	it("factorises", () => {
		const qMinus1 = 12n;
		const r = 2n;
		const expected = { s: 2n, t: 3n };
		const result = factoriseQMinus1(qMinus1, r);
		expect(result).toEqual(expected);
	});
});

describe("Adleman-Manders-Miller", () => {
	it("calculates the square root: 3^(1/2) = 5 or 6 mod 11", () => {
		const q = 11n;
		const delta = 3n;
		const r = 2n;
		const roots = [5n, 6n];
		const result = adlemanMandersMiller({ q, delta, r });
		expect(roots).toContainEqual(result);
	});

	it("calculates the cubic root: 6^(1/3) = 3 or 5 or 6 mod 7", () => {
		const q = 7n;
		const delta = 6n;
		const r = 3n;
		const roots = [3n, 5n, 6n];
		const result = adlemanMandersMiller({ q, delta, r });
		expect(roots).toContainEqual(result);
	});

	it("calculates the fourth root: 3^(1/4) = 2 or 3 or 10 or 11 mod 13", () => {
		const q = 13n;
		const delta = 3n;
		const r = 4n;
		const roots = [2n, 3n, 10n, 11n];
		const result = adlemanMandersMiller({ q, delta, r });
		expect(roots).toContainEqual(result);
	});

	it("throws if delta is less than 1", () => {
		const q = 11n;
		const delta = 0n;
		const r = 3n;
		expect(adlemanMandersMiller.bind(null, { q, delta, r })).toThrowError(
			/delta \(0\) must be 1 or greater/i,
		);
	});

	it("throws if delta is greater than or equal to q", () => {
		const q = 11n;
		const delta = 11n;
		const r = 3n;
		expect(adlemanMandersMiller.bind(null, { q, delta, r })).toThrowError(
			/delta \(11\) must be less than q \(11\)/i,
		);
	});

	it("throws if r does not divide into q - 1", () => {
		const q = 11n;
		const delta = 3n;
		const r = 3n;
		expect(adlemanMandersMiller.bind(null, { q, delta, r })).toThrowError(
			/r \(3\) must divide q - 1 \(10\) without remainder/i,
		);
	});

	it("throws if the greatest common divisor of r and t is not 1", () => {
		const q = 41n;
		const delta = 3n;
		const r = 4n;
		expect(adlemanMandersMiller.bind(null, { q, delta, r })).toThrowError(
			/Greatest common divisor of r \(4\) and t \(10\) must be 1/i,
		);
	});
});
