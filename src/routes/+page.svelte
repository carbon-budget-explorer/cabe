<script lang="ts">
	import logo from '$lib/logo.svg';
	export const prerender = true;
</script>

<main
	class="container mx-auto grid grid-cols-[1fr_auto] items-center justify-items-center gap-20 bg-base-200 px-20 pt-10"
>
	<div class="grid grid-cols-2">
		<img src={logo} class="h-full" alt="Logo for Carbon Budget Explorer" />
		<div class="text-6xl font-bold">
			<p>Carbon</p>
			<p>Budget</p>
			<p>Explorer</p>
		</div>
	</div>
	<div class="prose">
		<h2>Your fair climate policy in three steps.</h2>
		<ol>
			<li>
				<h3>Set global targets</h3>
				<p>Determine the global carbon budget and pathway</p>
			</li>
			<li>
				<h3>Choose your effort-sharing principle</h3>
				<p>Establish each country's "fair" contribution</p>
			</li>
			<li>
				<h3>Observe individual country results</h3>
				<p>Explore the pathway for your country in more detail</p>
			</li>
		</ol>
	</div>

	<div class="prose max-w-none">
		<h2>What is fair climate action?</h2>
		<p>
			While many countries commit to rapid climate action, no one likes to do more than their fair
			share. But what is fair? Is it the rich countries, because they have the means to do so? Or
			the countries that have emitted a lot in the past? Clearly, there is no single answer, because
			it depends on what you think is fair. However, these principles can be quantified.
		</p>
	</div>

	<a class="btn-primary btn-lg btn" href="/global"> Start exploring &raquo; </a>
</main>
