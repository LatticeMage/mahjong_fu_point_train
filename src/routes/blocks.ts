// blocks.ts

export type Tile = string;

export interface Tiles<N extends number> {
	tiles: N extends 2
		? [Tile, Tile]
		: N extends 3
			? [Tile, Tile, Tile]
			: N extends 4
				? [Tile, Tile, Tile, Tile]
				: Tile[];
	open?: Tile;
	ron?: Tile;
}

// Meld is Tiles of length 3 or 4, plus kind
export interface Meld extends Tiles<3 | 4> {
	kind: 'chi' | 'pon' | 'kan';
}

// Pair is Tiles of length 2, with optional isOpen
export type Pair = Tiles<2>;

// BaseForm remains the same: 4 melds + 1 pair
export type BaseForm = [Meld, Meld, Meld, Meld, Pair];
