<script lang="ts">
	import { clsx } from 'clsx';
	import { page } from '$app/stores';
</script>

<div class="tabs">
	<a
		href={`/global${$page.url.search}`}
		class={clsx('tab-lifted tab tab-lg', $page.url.pathname === '/global' && 'tab-active')}
		>Global budget</a
	>
	<a
		href={`/map${$page.url.search}`}
		class={clsx('tab-lifted tab tab-lg', $page.url.pathname === '/map' && 'tab-active')}
		>World map with shares</a
	>
</div>
