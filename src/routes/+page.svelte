<script lang="ts">
	import logo from '$lib/logo.svg';
	export const prerender = true;
</script>

<main class="grid h-full grid-cols-2 content-around gap-20 p-40 bg-base-100 ">
	<div class="flex flex-row">
		<img src={logo} class="h-full" alt="Logo for Carbon Budget Explorer" />
		<div class="text-6xl font-bold">
			<div>Carbon</div>
			<div>Budget</div>
			<div>Explorer</div>
		</div>
	</div>
	<a
		class="btn btn-primary btn-lg rounded-lg self-center"
		href="/global"
	>
		Construct your pathway &raquo;
	</a>

	<div class="col-span-2 text-2xl">
		Welcome to the Carbon Budget Explorer. This tool allows you to explore the carbon budget for the
		world, and find how each country can contribute to the global effort to limit warming.
	</div>
</main>
