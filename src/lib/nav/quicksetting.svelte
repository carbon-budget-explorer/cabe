<script lang="ts">
	export let options: string[];
	export let value: string;
	let active: boolean = false;
</script>

<span class="relative flex">
	<span class="flex h-6 w-6 items-center">
		<slot />
	</span>
	{value}
</span>
<div class="absolute top-0" />
