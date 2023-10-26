<script lang="ts">
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
			<button class="btn-ghost btn-square btn px-10">About</button>
		</div>
	</div>

	<div class="grow bg-base-200 p-4">
		<slot />
	</div>
</div>
