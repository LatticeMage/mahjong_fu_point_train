<script lang="ts">
	import { onMount } from 'svelte';
	import { GenBaseForm } from './gen-blocks';
	import { BaseForm2Str } from './to_str';

	// --- State ---

	// Signal for the input pattern
	let combination = $state('');

	// Derived list of parsed elements from the input pattern
	let parsedElements = $derived(parseInput(combination));

	// Cache for normal tile images
	interface TileImageSources {
		normalSrc: string;
	}
	let tileCache: Record<string, TileImageSources> = $state({});
	let isLoadingCache = $state(true);

	interface TileElement {
		type: 'tile' | 'meld' | 'separator';
		code?: string;
		tiles?: Array<{ code: string; rotated: boolean }>;
	}

	onMount(async () => {
		const suits = ['m', 'p', 's'];
		const honors = ['z'];
		const tileCodesToCache: string[] = [];

		// Generate all possible tile codes (0-9 for m,p,s and 1-7 for z)
		for (const suit of suits) {
			for (let i = 0; i <= 9; i++) {
				tileCodesToCache.push(`${i}${suit}`);
			}
		}
		for (const honor of honors) {
			for (let i = 1; i <= 7; i++) {
				tileCodesToCache.push(`${i}${honor}`);
			}
		}

		const cache: Record<string, TileImageSources> = {};
		const promises = tileCodesToCache.map(async (code) => {
			const normalSrc = `https://cdn.tenhou.net/2/t/${code}.gif`;
			cache[code] = { normalSrc };
		});

		await Promise.all(promises);
		tileCache = cache;
		isLoadingCache = false;
	});

	function parseInput(str: string): TileElement[] {
		const result: TileElement[] = [];
		let i = 0;
		while (i < str.length) {
			if (str[i] === '[') {
				const endBracket = str.indexOf(']', i);
				if (endBracket !== -1) {
					const meldContent = str.substring(i + 1, endBracket);
					result.push({ type: 'meld', tiles: parseMeld(meldContent) });
					i = endBracket + 1;
					continue;
				}
			}
			if (str[i] === ':') {
				result.push({ type: 'separator' });
				i++;
				continue;
			}
			const regex = /(\d+)([a-zA-Z])/g;
			regex.lastIndex = i;
			const match = regex.exec(str);
			if (match && match.index === i) {
				const [fullMatch, digits, letter] = match;
				for (const digit of digits) {
					result.push({ type: 'tile', code: `${digit}${letter}` });
				}
				i = match.index + fullMatch.length;
			} else {
				i++;
			}
		}
		return result;
	}

	function parseMeld(content: string): Array<{ code: string; rotated: boolean }> {
		const tiles: Array<{ code: string; rotated: boolean }> = [];
		let i = 0;
		while (i < content.length) {
			if (content[i] === '(') {
				const endParen = content.indexOf(')', i);
				if (endParen !== -1) {
					const rotatedContent = content.substring(i + 1, endParen);
					const regex = /(\d+)([a-zA-Z])/g;
					let match;
					regex.lastIndex = 0;
					while ((match = regex.exec(rotatedContent)) !== null) {
						const [_, digits, letter] = match;
						for (const digit of digits) {
							tiles.push({ code: `${digit}${letter}`, rotated: true });
						}
					}
					i = endParen + 1;
					continue;
				}
			}
			const regex = /(\d+)([a-zA-Z])/g;
			regex.lastIndex = i;
			const match = regex.exec(content);
			if (match && match.index === i) {
				const [fullMatch, digits, letter] = match;
				for (const digit of digits) {
					tiles.push({ code: `${digit}${letter}`, rotated: false });
				}
				i = match.index + fullMatch.length;
			} else {
				i++;
			}
		}
		return tiles;
	}

	function generateRandomCombination() {
		const form = GenBaseForm();
		combination = BaseForm2Str(form);
	}
</script>

<div class="mb-4">
	<label for="pattern-input" class="mb-2 block font-semibold">Enter pattern:</label>
	<div class="flex items-center">
		<input
			id="pattern-input"
			type="text"
			bind:value={combination}
			class="w-[30em] rounded border border-gray-300 p-2 text-base"
			placeholder="e.g., 123m[1(1)11s]:4z"
		/>
		<button
			onclick={generateRandomCombination}
			class="ml-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Generate
		</button>
	</div>
</div>

<!-- Main display area for tiles -->
<div class="flex min-h-[47px] flex-wrap items-end">
	{#if isLoadingCache}
		<p class="text-gray-500">Loading tile images...</p>
	{:else}
		{#each parsedElements as element, i (i)}
			{@const code = element.code ?? ''}
			{#if element.type === 'tile'}
				<img src={tileCache[code]?.normalSrc} alt={code} class="h-[47px] w-[31px]" />
			{:else if element.type === 'meld'}
				<div class="mx-[4px] flex flex-wrap items-end gap-0">
					{#if element.tiles}
						{@const hasRotated = element.tiles.some((t) => t.rotated)}
						{@const isFourTiles = element.tiles.length === 4}

						{#if isFourTiles && hasRotated}
							<!-- Case: Added Kan e.g., [1s (1s) 1s 1s] -->
							{@const rotatedTile = element.tiles.find((t) => t.rotated)}
							{@const normalTiles = element.tiles.filter((t) => !t.rotated)}

							<img
								src={tileCache[normalTiles[0]?.code]?.normalSrc}
								alt={normalTiles[0]?.code}
								class="h-[47px] w-[31px]"
							/>
							<img
								src={tileCache[normalTiles[1]?.code]?.normalSrc}
								alt={normalTiles[1]?.code}
								class="h-[47px] w-[31px]"
							/>
							<!-- Stacked column of two pre-rotated tiles -->
							<div class="flex flex-col">
								<img
									src={`https://lattice.posetmage.com/tenhou/rot/${rotatedTile?.code}.gif`}
									alt={rotatedTile?.code}
									class="h-[31px] w-[47px]"
								/>
								<img
									src={`https://lattice.posetmage.com/tenhou/rot/${normalTiles[2]?.code}.gif`}
									alt={normalTiles[2]?.code}
									class="h-[31px] w-[47px]"
								/>
							</div>
						{:else if isFourTiles && !hasRotated}
							<!-- Case: Closed Kan e.g., [6s 6s 6s 6s] -->
							{#each element.tiles as tile, tileIndex}
								{#if tileIndex === 0 || tileIndex === element.tiles.length - 1}
									<div class="h-[47px] w-[31px] rounded bg-blue-500"></div>
								{:else}
									<img
										src={tileCache[tile.code]?.normalSrc}
										alt={tile.code}
										class="h-[47px] w-[31px]"
									/>
								{/if}
							{/each}
						{:else}
							<!-- Regular meld handling (e.g., pon, chi) -->
							{#each element.tiles as tile}
								{#if tile.rotated}
									<img
										src={`https://lattice.posetmage.com/tenhou/rot/${tile.code}.gif`}
										alt={tile.code}
										class="h-[31px] w-[47px]"
									/>
								{:else}
									<img
										src={tileCache[tile.code]?.normalSrc}
										alt={tile.code}
										class="h-[47px] w-[31px]"
									/>
								{/if}
							{/each}
						{/if}
					{/if}
				</div>
			{:else if element.type === 'separator'}
				<div class="mx-[4px] text-2xl font-bold">:</div>
			{/if}
		{/each}
	{/if}
</div>

<div style="height: 20px;"></div>

<div class="mb-4">
	<div class="flex flex-wrap gap-2">
		{#each [20, 30, 40, 50, 60, 70, 80, 90, 100] as value}
			<button onclick={() => value} class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
				{value}符
			</button>
		{/each}
	</div>
</div>
