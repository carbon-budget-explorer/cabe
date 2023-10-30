<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import logo from '$lib/logo.svg';
</script>

<div class="flex h-screen max-h-screen flex-col" data-theme="corporate">
	<!-- TODO have navbar or no navbar on for root page? Now no navbar -->
	{#if $page.url.pathname === '/'}
		<slot />
	{:else}
		<div class="navbar bg-primary">
			<div class="flex-1">
				<a href={`/${$page.url.search}`} class="btn-ghost btn text-xl normal-case"
					><img src={logo} class="h-full" alt="Logo for Carbon Budget Explorer" /> | Carbon Budget Explorer</a
				>
			</div>
			<div class="flex-none">
				<a href="/about" class="btn-ghost btn-square btn px-10">About</a>
			</div>
		</div>

		<div class="grow bg-base-200 p-4">
			<slot />
		</div>
	{/if}
</div>
