<script lang="ts">
	const activeli = 'flex items-center space-x-2.5 text-blue-600 dark:text-blue-500';
	const passiveli = 'flex items-center space-x-2.5 text-gray-500 dark:text-gray-400';
	const activespan =
		'flex h-8 w-8 shrink-0 items-center justify-center rounded-full dark:border-blue-500';
	const passivespan =
		'flex h-8 w-8 shrink-0 items-center justify-center rounded-full dark:border-gray-400';

	import '../app.css';
	import { page } from '$app/stores';
	import Globe from '$lib/icons/globe.svelte';
	import Sharing from '$lib/icons/sharing.svelte';
	import Details from '$lib/icons/details.svelte';
	import Compare from '$lib/icons/compare.svelte';
	import Arrows from '$lib/icons/arrows.svelte';
	import Temperature from '$lib/icons/temperature.svelte';
	import Risk from '$lib/icons/risk.svelte';
	import Nonco2 from '$lib/icons/nonco2.svelte';
	import Negemiss from '$lib/icons/negemiss.svelte';
	import Negemiss2 from '$lib/icons/negemiss2.svelte';
	import Quicksetting from '$lib/nav/quicksetting.svelte';
</script>

<div class="flex h-screen max-h-screen flex-col">
	<nav class="flex flex-row items-center justify-between space-x-8 bg-slate-100 p-2">
		<a href={`/${$page.url.search}`}>Carbon Budget Explorer logo</a>
		<ol class="grow items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
			<!-- TODO when pathway has been selected mark this step as completed -->
			<li class="flex items-center gap-4">
				<span class="flex h-12 w-12 items-center">
					<Globe />
				</span>
				<span class="flex flex-col items-center">
					<span class="flex h-8 items-center">
						<span class="">Global carbon</span>
					</span>
					<span class="h-1 w-full bg-slate-300" />
					<span class="flex h-8 w-full items-center gap-2">
						<Quicksetting value="1.5">
							<Temperature />
						</Quicksetting>
						<Quicksetting value="Low">
							<Risk />
						</Quicksetting>
						<Quicksetting value="0.2">
							<Nonco2 />
						</Quicksetting>
						<Quicksetting value="high">
							<Negemiss />
						</Quicksetting>
					</span>
				</span>
			</li>
			<Arrows />

			<li class="flex items-center gap-4">
				<span class="flex h-6 w-6 items-center">
					<Sharing />
				</span>
				<span class="flex flex-col items-center">
					<span class="flex items-center">
						<span class="">Effort sharing</span>
					</span>
					<span class="flex h-8 w-full">
						<span class="flex h-6 w-6 items-center">
							<Temperature />
						</span>PCC
						<span class="flex h-6 w-6 items-center">
							<Temperature />
						</span>NL
					</span>
				</span>
			</li>

			<!-- TODO when a effort sharing principle has been selected mark this step as completed -->
			<Arrows />
			<li class={$page.url.pathname.startsWith('/regions') ? activeli : passiveli}>
				<span class={$page.url.pathname.startsWith('/regions') ? activespan : passivespan}>
					<Details />
				</span>
				<span>
					<a href={`/regions${$page.url.search}`}>
						<h3 class="font-medium leading-tight">Country details</h3>
					</a>
				</span>
			</li>
			<Arrows />
			<li class={$page.url.pathname.startsWith('/compare') ? activeli : passiveli}>
				<span class={$page.url.pathname.startsWith('/compare') ? activespan : passivespan}>
					<Compare />
				</span>
				<span>
					<h3 class="font-medium leading-tight">Compare</h3>
				</span>
			</li>
		</ol>
		<a href="/about" title="About" class:font-bold={$page.url.pathname === '/about'}>
			<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
				><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
				/></svg
			>
		</a>
	</nav>
	<div class="grow p-4">
		<slot />
	</div>
</div>
