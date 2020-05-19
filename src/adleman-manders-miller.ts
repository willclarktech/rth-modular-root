import { strict as assert } from "assert";
import { gcd, modPow, randBetween } from "bigint-crypto-utils";

export const getBaseLog = (base: bigint, n: bigint): bigint =>
	BigInt(Math.log(Number(n)) / Math.log(Number(base)));

export const findU = (t: bigint, r: bigint): bigint => {
	let u = 1n;
	while ((r * u - 1n) % t) {
		++u;
	}
	return u;
};

export const findAAndC = (
	t: bigint,
	r: bigint,
	s: bigint,
	q: bigint,
): { readonly a: bigint; readonly c: bigint } => {
	const rho = randBetween(q, 1n);
	const c = modPow(rho, t, q);
	const a = modPow(c, r ** (s - 1n), q);
	return a === 1n ? findAAndC(t, r, s, q) : { a, c };
};

export const factoriseQMinus1 = (
	qMinus1: bigint,
	r: bigint,
	s = 0n,
): { readonly s: bigint; readonly t: bigint } =>
	qMinus1 % r === 0n
		? factoriseQMinus1(qMinus1 / r, r, s + 1n)
		: { s, t: qMinus1 };

export type Parameters = {
	readonly q: bigint;
	readonly delta: bigint;
	readonly r: bigint;
};

export const adlemanMandersMiller = ({ q, delta, r }: Parameters): bigint => {
	const qMinus1 = q - 1n;
	assert(1 <= delta, `delta (${delta}) must be 1 or greater`);
	assert(delta < q, `delta (${delta}) must be less than q (${q})`);
	assert(
		qMinus1 % r === 0n,
		`r (${r}) must divide q - 1 (${qMinus1}) without remainder`,
	);

	const { s, t } = factoriseQMinus1(qMinus1, r);
	assert(
		gcd(r, t) === 1n,
		`Greatest common divisor of r (${r}) and t (${t}) must be 1`,
	);

	const u = findU(t, r);
	const aAndC = findAAndC(t, r, s, q);
	const { a } = aAndC;
	let { c } = aAndC;
	let b = modPow(delta, r * u - 1n, q);
	let h = 1n;

	for (let i = 1n; i < s - 1n; ++i) {
		const d = modPow(b, r ** (s - 1n - i), q);
		const j = d === 1n ? 0n : -getBaseLog(a, d);
		const cR = modPow(c, r, q);
		b = (b * modPow(cR, j, q)) % q;
		h = (h * modPow(c, j, q)) % q;
		c = cR;
	}

	return (modPow(delta, u, q) * h) % q;
};
