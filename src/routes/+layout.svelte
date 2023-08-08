<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

<div class="h-[750px]">
	<nav class="flex flex-row space-x-8 bg-slate-100 p-4">
		<a href={`/${$page.url.search}`}>Carbon Budget Explorer logo</a>
		<ul class="flex flex-row space-x-6">
			<li>
				<a href={`/${$page.url.search}`} title="Home" class:font-bold={$page.url.pathname === '/'}
					>Home</a
				>
			</li>
			<li>
				<a href={`/world${$page.url.search}`} class:font-bold={$page.url.pathname === '/world'}
					>World</a
				>
			</li>
			<li>
				<a
					href={`/world${$page.url.search}`}
					class:font-bold={$page.url.pathname.startsWith('/region')}>Region</a
				>
			</li>
			<li>
				<a href="/about" class:font-bold={$page.url.pathname === '/about'}>About</a>
			</li>
		</ul>
	</nav>
	<div class="h-full p-2">
		<slot />
	</div>
</div>
