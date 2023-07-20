<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

<nav class="p-4 bg-slate-100 flex flex-row space-x-8">
	<p>Carbon Budget Explorer logo</p>
	<ul class="flex flex-row space-x-6">
		<li>
			<a href="/" title="Home" class:font-bold={$page.url.pathname === '/'}>Home</a>
		</li>
		<li>
			<a href="/world" class:font-bold={$page.url.pathname === '/world'}>World</a>
		</li>
		<li>
			<a href="/world" class:font-bold={$page.url.pathname.startsWith('/region')}>Region</a>
		</li>
	</ul>
</nav>
<div class="p-2">
	<slot />
</div>
