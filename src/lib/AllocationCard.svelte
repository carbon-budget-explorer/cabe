<script lang="ts">
	import { clsx } from 'clsx';

	import { page } from '$app/stores';

	// Enable binding to allocationTime
	export let allocationTime = '2030';
	const allocOptions = ['2030', '2040']; // 2050
	function updateAlloc(option: string) {
		allocationTime = option;
	}
</script>

<div class="card card-compact prose min-w-full bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="not-prose card-title">Allocation on map</h2>
		{#if $page.url.pathname === '/map'}
			<div class="btn-group flex w-full flex-row justify-items-stretch">
				{#each allocOptions as option}
					<button
						class={clsx('btn flex-1', option === allocationTime && 'btn-primary')}
						on:click={() => updateAlloc(option)}>{option}</button
					>
				{/each}
			</div>
		{/if}
	</div>
</div>
