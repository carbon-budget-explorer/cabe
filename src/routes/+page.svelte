<script lang="ts">
	import logo from '$lib/logo.svg';
	export const prerender = true;
</script>

<main class="container mx-auto flex h-full w-4/5 flex-col items-stretch justify-around">
	<div class="flex h-2/3 flex-row items-center justify-around">
		<div class="flex flex-col items-end gap-6">
			<div class="flex flex-row items-center gap-8">
				<!-- Logo -->
				<img src={logo} class="color-filter h-36 xl:h-64" alt="Logo for Carbon Budget Explorer" />
				<div class="text-4xl font-bold xl:text-6xl">
					<p>Carbon</p>
					<p>Budget</p>
					<p>Explorer</p>
				</div>
			</div>
			<h2 class="mb-6 text-3xl italic">Your fair climate policy in three steps</h2>
		</div>

		<div class="flex flex-col">
			<div class="">
				<ol>
					<li class="mb-1 flex flex-row">
						<h3
							class="z-50 h-12 w-12 rounded-full bg-primary pt-2 text-center text-xl font-semibold text-neutral-content"
						>
							1.
						</h3>
						<div class="-ml-6 flex-1 -skew-x-[20deg] rounded bg-secondary p-4 px-10" style="opacity: 0.75;">
							<h3 class="mb-2 text-xl font-semibold text-neutral-content">Set global targets</h3>
							<p class="text-neutral-content">Determine the global carbon budget and pathway</p>
						</div>
					</li>
					<li class="mb-1 flex flex-row items-start">
						<h3
							class="z-50 h-12 w-12 rounded-full bg-primary pt-2 text-center text-xl font-semibold text-neutral-content"
						>
							2.
						</h3>
						<div class="-ml-6 flex-1 -skew-x-[20deg] rounded bg-neutral p-4 px-10" style="opacity: 0.75;">
							<h3 class="mb-2 text-xl font-semibold text-neutral-content">Choose your effort-sharing principle</h3>
							<p class="text-neutral-content">Establish each country's "fair" contribution</p>
						</div>
					</li>
					<li class="mb-1 flex flex-row items-start">
						<h3
							class="z-50 h-12 w-12 rounded-full bg-primary pt-2 text-center text-xl font-semibold text-neutral-content"
						>
							3.
						</h3>
						<div class="-ml-6 flex-1 -skew-x-[20deg] rounded bg-neutral p-4 px-10">
							<h3 class="mb-2 text-xl font-semibold text-neutral-content">Observe individual country results</h3>
							<p class="text-neutral-content">Explore the pathway for your country in more detail</p>
						</div>
					</li>
				</ol>
			</div>
		</div>
	</div>

	<!-- text -->
	<div class="">
		<!-- <h2>What is fair climate action?</h2> -->
		<p>
			While many countries commit to rapid climate action, no one likes to do more than their fair
			share. But what is fair? Is it the rich countries, because they have the means to do so? Or
			the countries that have emitted a lot in the past? Clearly, there is no single answer, because
			it depends on what you think is fair. However, these principles can be quantified.
		</p>
	</div>

	<a class="btn-primary btn-lg btn w-4/5 self-center" href="/global"> Start exploring &raquo; </a>
</main>

<style>
	.color-filter {
		filter: invert(11%) sepia(6%) saturate(127%) hue-rotate(314deg) brightness(101%) contrast(80%);
	}
</style>
