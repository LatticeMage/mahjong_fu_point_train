<script>
	import Fu from './fu.svelte';
	import Point from './point.svelte';
</script>

<main class="space-y-8 p-6">
	<!-- Fu component region -->
	<section class="rounded-2xl bg-white p-4 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">符の計算練習</h2>
		<Fu />
	</section>

	<!-- Point component region -->
	<section class="rounded-2xl bg-white p-4 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">基本点の計算練習</h2>
		<Point />
	</section>
</main>
