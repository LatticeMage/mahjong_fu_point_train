// gen-blocks.ts

import type { Tile, Meld, Pair, BaseForm } from './blocks';
import { CheckTileCounts } from './check';

const SUITS = ['m', 'p', 's'] as const;
const HONORS = ['z'] as const;
const CATEGORIES = [...HONORS, ...SUITS] as const;

type Category = (typeof CATEGORIES)[number];

function getRandomElement<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTile(cat: Category, rank: number): Tile {
	return `${rank}${cat}`;
}

// Weighted array: 5x chi, 2x pon, 1x kan
const meldTypes: ('chi' | 'pon' | 'kan')[] = [
	...Array(1).fill('chi'),
	...Array(1).fill('pon'),
	'kan'
];

export function GenMeld(): Meld {
	const kind = getRandomElement(meldTypes);

	let tiles: Tile[];
	let open: Tile | undefined;

	if (kind === 'chi') {
		const suit = getRandomElement(SUITS);
		const startRank = getRandomInt(1, 7);

		tiles = [
			generateTile(suit, startRank),
			generateTile(suit, startRank + 1),
			generateTile(suit, startRank + 2)
		];

		// red dora logic
		tiles = tiles.map((tile) => {
			if (tile[0] === '5' && SUITS.includes(tile[1] as (typeof SUITS)[number])) {
				if (Math.random() < 0.25) {
					return `0${tile[1]}` as Tile;
				}
			}
			return tile;
		});

		// Optional open tile removal
		const need_open = Math.random();
		if (need_open < 0.05) {
			open = tiles[0];
			tiles = [tiles[1], tiles[2]];
		} else if (need_open < 0.1) {
			open = tiles[1];
			tiles = [tiles[0], tiles[2]];
		} else if (need_open < 0.15) {
			open = tiles[2];
			tiles = [tiles[0], tiles[1]];
		}

		return {
			tiles: tiles as [Tile, Tile, Tile],
			kind,
			open
		};
	}

	// pon or kan
	const cat = getRandomElement(CATEGORIES);
	const rank = cat === 'z' ? getRandomInt(1, 7) : getRandomInt(1, 9);
	const tile = generateTile(cat, rank);

	if (kind === 'pon') {
		tiles = [tile, tile, tile];
		// Optional open
		const openIndex = Math.floor(Math.random() * 3);
		if (Math.random() < 0.15) {
			open = tiles[openIndex];
			tiles = tiles.filter((_, i) => i !== openIndex);
		}

		return {
			tiles: tiles as [Tile, Tile, Tile],
			kind,
			open
		};
	} else {
		// kan
		tiles = [tile, tile, tile, tile];

		if (rank === 5 && cat !== 'z') {
			tiles[0] = `0${cat}`;
		}

		const openIndex = Math.floor(Math.random() * 4);
		if (Math.random() < 0.15) {
			open = tiles[openIndex];
			tiles = tiles.filter((_, i) => i !== openIndex);
			return {
				tiles: tiles as [Tile, Tile, Tile],
				kind,
				open
			};
		}

		return {
			tiles: tiles as [Tile, Tile, Tile, Tile],
			kind
		};
	}
}

export function GenPair(): Pair {
	const cat = getRandomElement(CATEGORIES);
	const rank = cat === 'z' ? getRandomInt(1, 7) : getRandomInt(1, 9);

	const baseTile: Tile = `${rank}${cat}`;
	let tiles: [Tile, Tile] = [baseTile, baseTile];

	if (rank === 5 && cat !== 'z') {
		const redTile: Tile = `0${cat}`;
		const idx = Math.floor(Math.random() * 2);
		tiles = idx === 0 ? [redTile, baseTile] : [baseTile, redTile];
	}

	return { tiles };
}

export function GenBaseForm(): BaseForm {
	let baseForm: BaseForm;

	while (true) {
		const candidate: BaseForm = [GenMeld(), GenMeld(), GenMeld(), GenMeld(), GenPair()];
		const check = CheckTileCounts(candidate);
		if (check.valid) {
			baseForm = candidate;
			break;
		}
	}

	// Sset ron
	const melds = baseForm.slice(0, 4) as Meld[];
	const pair = baseForm[4];

	const eligibleMelds = melds.filter((m) => !m.open && m.kind !== 'kan');
	const candidates: (Meld | Pair)[] = [...eligibleMelds];

	// Only include pair if not open (always true here, as Pair has no open)
	candidates.push(pair);

	if (candidates.length > 0) {
		const target = getRandomElement(candidates);
		const idx = getRandomInt(0, target.tiles.length - 1);
		const ronTile = target.tiles[idx];
		target.tiles.splice(idx, 1); // remove tile
		target.ron = ronTile;
	}

	return baseForm;
}
