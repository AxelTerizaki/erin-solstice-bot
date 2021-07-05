import { Wimoney } from '../types/wimoney';

/**
 * Those rates should only be default,
 * that anyone would be able to override them by settings
 */
export const rates: Wimoney = {
	base: 1,
	copper: 1,
	silver: 10,
	gold: 200
};

/**
 * Convert a flat money amount to Wandering Inn Money format
 * @param flat money amount
 * @returns
 */
export function flat2wim(flat: number): Wimoney {
	const res: Wimoney = {
		base: flat,
		copper: 0,
		silver: 0,
		gold: 0
	};
	res.gold = Math.floor(flat / rates.gold);
	flat -= res.gold * rates.gold;
	res.silver = Math.floor(flat / rates.silver);
	flat -= res.silver * rates.silver;
	res.copper = Math.floor(flat);
	return res;
}

/**
 * Convert a flat money to properly formatted short string using Wandering Inn Money format
 * @param flat money amount
 * @returns
 */
export function flat2wimString(flat: number): string {
	let formatted = '';
	const f: string[] = [];
	const wim: Wimoney = flat2wim(flat);
	if (0 < wim.gold) {
		f.push(`:yellow_circle: ${wim.gold} gold coin${(wim.gold > 1)? 's':''}`);
	}
	if (0 < wim.silver) {
		f.push(`:white_circle: ${wim.silver} silver coin${(wim.silver > 1)? 's':''}`);
	}
	if (0 < wim.copper) {
		f.push(`:brown_circle: ${wim.copper} copper coin${(wim.copper > 1)? 's':''}`);
	}
	if (f.length > 1) {
		formatted = `${f.slice(0, -1).join(', ')} and ${f.slice(-1)[0]}`;
	} else {
		formatted = f[0];
	}
	return formatted;
}

/**
 * Convert back a Wandering Inn Money format to flat amount.
 * @param wim
 * @returns
 */
export function wim2flat(wim: Wimoney): number {
	return wim.copper + (wim.silver * rates.silver) + (wim.gold * rates.gold);
}

/**
 * Format a flat mount of money to a full proper text.
 * @param money money amount
 * @returns
 */
export function format(money: number): string {
	let res = '';
	if (0 === money) {
		res = 'You are currently broke, without any copper coin.';
	} else {
		const formatted = flat2wimString(money);
		if (0 > money) { // should never happens, but who knows ?
			res = `You actually owe the inn ${formatted}! This is bad, you know.`;
		} else {
			res = `You actually own ${formatted}!`;
		}
	}
	return res;
}
