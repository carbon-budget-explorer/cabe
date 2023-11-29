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
		<div class="flex-none">
			<a href="/about" class="btn-ghost btn-square btn px-10">About</a>
		</div>
	</div>
	<div class={clsx($page.url.pathname === '/' && 'fancy-gradient', 'flex-1 bg-base-200 p-4')}>
		<slot />
	</div>
</div>

<style>
	.fancy-gradient {
		background: #0069AA;
		background: radial-gradient(
			500% 100% at 50% top,
			#0069AA 7%,
			#0099D9 75%,
			#c8c8c8 100%
		);
	}
</style>
