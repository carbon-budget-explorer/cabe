<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import logo from '$lib/logo.svg';
	import clsx from 'clsx';
</script>

<div class=" flex h-screen flex-col overflow-auto" data-theme="mytheme">
	<div class="navbar bg-primary text-neutral-content">
		<div class="flex-1">
			<a href={`/${$page.url.search}`} class="btn-ghost btn text-xl normal-case"
				><img
					style="filter: invert(1);"
					src={logo}
					class="h-full text-current"
					alt="Logo for Carbon Budget Explorer"
				/> Carbon Budget Explorer</a
			>
		</div>
		<div class="alert" style="width: 50%">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-6 w-6 shrink-0 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span
				>This website is currently in beta and is subject to frequent updates. Please see the About
				page for more information</span
			>
		</div>
		<div class="flex-none">
			<a href="/about" class="btn-ghost btn-square btn px-10">About</a>
		</div>
	</div>
	<div class={clsx($page.url.pathname === '/' && 'fancy-gradient', 'flex-1 bg-base-200 p-4')}>
		<slot />
	</div>
	{#if $page.url.pathname === '/about'}
		<footer class="flex h-16 justify-around gap-10 bg-primary text-center">
			<p class="self-center">© 2023 Planbureau voor de Leefomgeving.</p>
			<img src="/logo_pbl.png" alt="logo_pbl" />
			<img src="/logo_ecemf.png" alt="logo_ecemf" />
			<img src="/logo_elevate.png" alt="logo_elevate" />
			<img src="/logo_escience.png" alt="logo_escience" />
		</footer>
	{/if}
</div>

<style>
	.fancy-gradient {
		background: rgb(49, 59, 114);
		background: radial-gradient(
			500% 100% at 50% top,
			rgba(49, 59, 114, 1) 7%,
			rgba(123, 146, 178, 1) 75%,
			rgba(200, 200, 200, 1) 100%
		);
	}
</style>
