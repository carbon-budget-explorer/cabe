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

<div class="flex h-screen max-h-screen flex-col" data-theme="corporate">
	<div class="navbar bg-primary">
		<div class="flex-1">
			<a href={`/${$page.url.search}`} class="btn-ghost btn text-xl normal-case"
				>Logo | Carbon Budget Explorer</a
			>
		</div>
		<div class="flex-none">
			<button class="btn-ghost btn-square btn">About</button>
		</div>
	</div>

	<div class="bg-base-200 p-4">
		<slot />
	</div>
</div>
