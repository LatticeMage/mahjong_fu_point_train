// check.ts

import type { BaseForm, Tile } from './blocks';

function getMaxCount(tile: Tile): number {
	const rank = tile[0];
	const suit = tile[1];

	// red dora: 0s, 0m, 0p — max 1
	if (rank === '0') return 1;

	// suited 5s (5m, 5p, 5s): max 3 (because 0 + 5 = max 4 total)
	if (rank === '5' && 'mps'.includes(suit)) return 3;

	// suited 1–4,6–9: max 4
	if ('mps'.includes(suit) && '12346789'.includes(rank)) return 4;

	// honors z: max 4
	if (suit === 'z' && '1234567'.includes(rank)) return 4;

	// fallback (should not happen)
	return 0;
}

export function CheckTileCounts(form: BaseForm): { valid: boolean; counts: Record<Tile, number> } {
	const counts: Record<Tile, number> = {};

	// Flatten all tiles including opens
	for (let i = 0; i < 5; i++) {
		const tiles = form[i];
		for (const tile of tiles.tiles) {
			counts[tile] = (counts[tile] || 0) + 1;
		}
		if (tiles.open) {
			counts[tiles.open] = (counts[tiles.open] || 0) + 1;
		}
		if (tiles.ron) {
			counts[tiles.ron] = (counts[tiles.ron] || 0) + 1;
		}
	}

	// Validate each tile against its max count
	for (const tile in counts) {
		if (counts[tile] > getMaxCount(tile)) {
			return { valid: false, counts };
		}
	}

	return { valid: true, counts };
}
