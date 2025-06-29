<script>
	import { onMount } from 'svelte';

	// Options arrays
	const fuOptions = Array.from({ length: 9 }, (_, i) => `${(i + 2) * 10}符`);
	const hanOptions = ['1飜', '2飜', '3飜', '4飜'];

	// Reactive state
	let currentFu = '';
	let currentHan = '';
	let parentPoints = '';
	let childPoints = '';

	// Generate a new random fu+han
	function genNew() {
		currentFu = fuOptions[Math.floor(Math.random() * fuOptions.length)];
		currentHan = hanOptions[Math.floor(Math.random() * hanOptions.length)];
	}

	onMount(genNew);
</script>

<main class="p-4">
	<div class="flex items-center space-x-4">
		<!-- Gen New Fu Button -->
		<button
			on:click={genNew}
			class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
		>
			Gen New Fu
		</button>

		<!-- Display generated result -->
		{#if currentFu && currentHan}
			<div class="text-lg font-medium">
				{currentFu} / {currentHan}
			</div>
		{/if}

		<!-- Inputs for 親 and 子 -->
		<div class="flex items-center space-x-2">
			<label class="flex items-center">
				親:
				<input
					type="text"
					bind:value={parentPoints}
					placeholder="点"
					class="ml-1 rounded border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</label>
			<label class="flex items-center">
				子:
				<input
					type="text"
					bind:value={childPoints}
					placeholder="点"
					class="ml-1 rounded border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</label>
		</div>
	</div>
</main>
