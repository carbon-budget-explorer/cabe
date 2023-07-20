<script lang="ts">
	import { principles as principlesMap } from '$lib/principles';
	export const principles = Array.from(principlesMap);
</script>

<h1 class="pb-20 text-3xl font-bold">Welcome to Carbon Budget Explorer</h1>

<div class="flex flex-wrap gap-10">
	{#each principles as principle}
		<div class="h-100 flex w-64 flex-col gap-2 rounded-md bg-gray-100 p-4 shadow-md">
			<h2 class="h-20 text-lg font-bold">{principle[1]}</h2>
			<a href={`/world?sv=${principle[0]}`}>
				<p class="w-42 bg-muted h-48 rounded-sm bg-slate-300 text-center">Logo</p>
			</a>
			<a class="underline" href={`/world?sv=${principle[0]}`}>Explore principle</a>
		</div>
	{/each}
</div>
