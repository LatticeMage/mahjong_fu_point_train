// to_str.ts

import type { BaseForm, Tile } from './blocks';

function extractSuit(tile: Tile): string {
	return tile.slice(-1);
}

function extractRank(tile: Tile): number {
	const rankChar = tile[0];
	return rankChar === '0' ? 5 : parseInt(rankChar, 10);
}

function sortTilesGrouped(tiles: Tile[]): string {
	const suitGroups: Record<string, Tile[]> = {};

	for (const tile of tiles) {
		const suit = extractSuit(tile);
		if (!suitGroups[suit]) suitGroups[suit] = [];
		suitGroups[suit].push(tile);
	}

	const resultParts: string[] = [];

	for (const suit of ['m', 'p', 's', 'z']) {
		if (!suitGroups[suit]) continue;

		const group = suitGroups[suit];

		group.sort((a, b) => {
			const ra = extractRank(a);
			const rb = extractRank(b);
			return ra - rb;
		});

		const numbers = group.map((t) => t[0]); // keep red '0' as is
		resultParts.push(numbers.join('') + suit);
	}

	return resultParts.join('');
}

export function BaseForm2Str(form: BaseForm): string {
	const left: Tile[] = [];
	const right: string[] = [];
	let ron: string | undefined;

	for (let i = 0; i < 5; i++) {
		const meld = form[i];
		const tiles = [...meld.tiles];
		const isKan = tiles.length === 4;

		if (meld.ron) {
			ron = meld.ron;
		}

		if (meld.open) {
			const insertIndex = Math.floor(Math.random() * (tiles.length + 1));
			tiles.splice(insertIndex, 0, `(${meld.open})`);
			right.push(`[${tiles.join(' ')}]`);
		} else if (isKan) {
			right.push(`[${tiles.join(' ')}]`);
		} else {
			left.push(...tiles);
		}
	}

	const leftStr = sortTilesGrouped(left);
	//leftStr = left.join(' ');
	const rightStr = right.join(' ');
	return `${leftStr} ${rightStr} : ${ron}`;
}
