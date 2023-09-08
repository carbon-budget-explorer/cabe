<script lang="ts">
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/PathwayForm.svelte';
	import RegionFilter from '$lib/RegionFilter.svelte';

	import VegaMap from '$lib/VegaMap.svelte';
	import { principles } from '$lib/principles';
	import type { PageData } from './$types';

	export let data: PageData;

	let region: string;
	const gotoRegion = (region: string) => {
		if (browser && region !== undefined && region !== '') {
			goto(`/regions/${region}${$page.url.search}`);
		}
	};
	$: gotoRegion(region);

	type ChangeEvent = Event & {
		currentTarget: EventTarget & (HTMLSelectElement | HTMLInputElement);
	};

	let selectedYear: number = data.year;
	function gotoYear(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('year', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	let showCountriesPanel = false;
	let showSettngsPanel = false;
</script>

<main class="flex h-full max-h-full w-full flex-row gap-2">
	<div class="flex grow flex-col">
		<div class="relative h-full w-full">
			<div class="absolute left-4 top-4">
				<button class="text-xl" on:click={() => showSettngsPanel = !showSettngsPanel}>⚙</button>
				{#if showSettngsPanel}
				<div class="bg-slate-50 shadow-lg p-2">
						<GlobalBudgetForm
				choices={data.pathway.choices}
				query={data.pathway.query}
				onChange={updateQueryParam}
					/>
					<div class="flex flex-col pt-4">
						<h2>Variable</h2>
						<label>
							<input type="radio" name="variable" value="CO2" checked />
							Full century CO2 budget
						</label>
						<label>
							<input type="radio" name="variable" value="CO2" checked />
							Temperature assessment
						</label>
					</div>
				</div>
				{/if}
			</div>
			<div class="h-full w-full bg-gray-200">
				<div class="flex items-center justify-center h-full w-full">
					Map
				</div>
			</div>
			<div class="absolute bottom-2 flex w-full flex-row justify-center gap-2">
				<button
					class="relative h-20 w-48 bg-orange-400 object-center text-center shadow-lg border-2 border-orange-950"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
				<button
					class="relative h-20 w-48 bg-orange-200 object-center text-center shadow-lg"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
				<button
					class="relative h-20 w-48 bg-orange-200 object-center text-center shadow-lg"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
				<button
					class="relative h-20 w-48 bg-orange-200 object-center text-center shadow-lg"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
				<button
					class="relative h-20 w-48 bg-orange-200 object-center text-center shadow-lg"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
				<button
					class="relative h-20 w-48 bg-orange-200 object-center text-center shadow-lg"
					title="Long description"
				>
					<p class="text-xl">Greenhouse development rights</p>
					<p class="text-sm">Short description or image</p>
					<a class="absolute right-1 top-1 inline-block text-xl" href="/about#grandfathering">ⓘ</a>
				</button>
			</div>
		</div>
	</div>
	<!-- TODO make region filter have own scroll bar and not move map down -->
	<div class="overflow-y-auto max-h-screen">
		<button
			title={showCountriesPanel ? 'Click to hide region list' : 'Click to search for region'}
			on:click={() => (showCountriesPanel = !showCountriesPanel)}
		>
			<span class={showCountriesPanel ? 'countries-panel-shown' : 'countries-panel-hidden'}
				>{showCountriesPanel ? '↦' : '↧'} Find region</span
			>
		</button>
		{#if showCountriesPanel}
			<div transition:slide={{ axis: 'x' }}>
				<RegionFilter regions={data.metrics} searchParams={$page.url.search} />
			</div>
		{/if}
	</div>
</main>

<style>
	.countries-panel-hidden {
		text-orientation: sideways;
		writing-mode: vertical-rl;
	}
	.countries-panel-shown {
		text-orientation: upright;
		writing-mode: horizontal-tb;
	}
</style>
