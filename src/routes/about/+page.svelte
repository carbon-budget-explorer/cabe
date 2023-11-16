<script lang="ts">
	import Answer from '$lib/Answer.svelte';
	import Question from '$lib/Question.svelte';
	import QA from '$lib/QA.svelte';

	export const prerender = true;
</script>

<!-- Sidebar -->
<div class="box-border flex h-full gap-4 bg-base-300">
	<div class="items-between flex h-full w-1/5 flex-col bg-base-300">
		<div class="card card-compact">
			<div class="card-body prose">
				<h2 class="card-title">Index</h2>
				<ul>
					<li>Scientific basis</li>
					<li>Societal relevance</li>
					<li>Technological aspects</li>
				</ul>
			</div>
		</div>
		<div class="card-compact card mt-auto">
			<div class="card-body prose">
				<h2 class="card-title">Contact</h2>
				<p>
					For more information you can contact the lead author of the scientific research on fair
					shares dr. Mark Dekker at mark.dekker@pbl.nl
				</p>
			</div>
		</div>
	</div>
	<!-- Main panel -->
	<main class="max-h-full flex-1 bg-base-100 p-4">
		<div class="prose ml-4 max-w-[60%]">
			<h1>Frequently asked questions</h1>
			<h2>Scientific basis</h2>

			<!-- <Question></Question>
			<Answer>

			</Answer>

			<Question></Question>
			<Answer>

			</Answer> -->
			<QA question="Where do the numbers on the global carbon budget come from?">
				The global carbon budget numbers are taken from Forster et al. (2023,
				https://essd.copernicus.org/articles/15/2295/2023/), who summarize updates of the WGI and
				WGIII reports of the IPCC, and updates of climate emulators. This paper directly reports CO2
				budgets, but also the implied paths on non-CO2. The latter is used, augmented with
				information on cost-optimal global pathways from the AR6 database, to infer yearly total
				greenhouse gas emissions over the coming century.
			</QA>
			<QA question="What are these effort-sharing principles?">
				Links to Van der Berg et al. and Robiou. Picture of allocations.
				<img src="/paper_preview.png" alt="paper preview" />
			</QA>
			<QA question="this is the question" />
		</div>
	</main>
</div>
