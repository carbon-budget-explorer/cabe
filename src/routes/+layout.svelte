<script lang="ts">
	const activeli = 'flex items-center space-x-2.5 text-blue-600 dark:text-blue-500';
	const passiveli = 'flex items-center space-x-2.5 text-gray-500 dark:text-gray-400';
	const activespan =
		'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-600 dark:border-blue-500';
	const passivespan =
		'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400';

	import '../app.css';
	import { page } from '$app/stores';
</script>

<div class="flex h-screen flex-col">
	<nav class="flex flex-row space-x-8 bg-slate-100 p-4">
		<div class="steps py-8">
			<ol class="w-full items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
				<li>
					<a href={`/${$page.url.search}`}>Carbon Budget Explorer logo</a>
				</li>
				<!-- TODO add arrow between stepper items -->
				<!-- TODO when pathway has been selected mark this step as completed -->
				<li class={$page.url.pathname === '/global' ? activeli : passiveli}>
					<span class={$page.url.pathname === '/global' ? activespan : passivespan}> 1 </span>
					<span>
						<h3 class="font-medium leading-tight">
							<a href={`/global${$page.url.search}`}> Construct your pathway </a>
						</h3>
					</span>
				</li>
				<!-- TODO when a effort sharing principle has been selected mark this step as completed -->
				<li class={$page.url.pathname === '/world' ? activeli : passiveli}>
					<span class={$page.url.pathname === '/world' ? activespan : passivespan}> 2 </span>
					<span>
						<h3 class="font-medium leading-tight">
							<a href={`/world${$page.url.search}`}> Choose your effort-sharing method </a>
						</h3>
					</span>
				</li>
				<li class={$page.url.pathname.startsWith('/regions') ? activeli : passiveli}>
					<span class={$page.url.pathname.startsWith('/regions') ? activespan : passivespan}>
						3
					</span>
					<span>
						<a href={`/regions${$page.url.search}`}>
							<h3 class="font-medium leading-tight">Get country details</h3>
						</a>
					</span>
				</li>
				<li class={$page.url.pathname.startsWith('/compare') ? activeli : passiveli}>
					<span class={$page.url.pathname.startsWith('/compare') ? activespan : passivespan}>
						4
					</span>
					<span>
						<h3 class="font-medium leading-tight">Compare</h3>
					</span>
				</li>
				<li class="">
					<a href="/about" title="About" class:font-bold={$page.url.pathname === '/about'}>?</a>
				</li>
			</ol>
		</div>
	</nav>
	<div class="grow p-4">
		<slot />
	</div>
</div>
