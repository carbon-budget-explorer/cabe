<script lang="ts">
	import QA from '$lib/QA.svelte';

	export const prerender = true;
</script>

<!-- Sidebar -->
<div class="flex h-full gap-4 rounded bg-primary">
	<div class="items-between flex h-full w-1/5 flex-col rounded bg-primary">
		<div class="card-compact card">
			<div class="card-body prose">
				<h2 class="card-title text-white">About</h2>
				<ul class="not-prose m-2 list-inside list-disc">
					<li class="text-lg font-semibold text-white"><a href="#scientific">Scientific basis</a></li>
					<li class="text-lg font-semibold text-white"><a href="#societal">Societal relevance</a></li>
					<li class="text-lg font-semibold text-white"><a href="#technology">Technological aspects</a></li>
				</ul>
			</div>
		</div>
		<div class="card-compact card mt-auto">
			<div class="card-body prose">
				<h2 class="card-title text-white">More information</h2>
				<p class="text-white">
					This tool has been developed by the <a
						href="https://www.esciencecenter.nl/"
						target="_blank"
						rel="noopener
					noreferrer" class="text-white">Netherlands eScience Center</a
					>
					in collaboration with the
					<a href="https://www.pbl.nl/en" target="_blank" rel="noopener noreferrer"
					class="text-white">Environmental Assessment Agency (PBL)</a
					>, in the context of the

					<a href="https://www.ecemf.eu/about/" target="_blank" rel="noopener noreferrer" class="text-white"
						>ECEMF project</a
					>. For more information you can contact the lead author of the scientific research on fair
					shares dr. Mark Dekker at <a href="mailto:mark.dekker@pbl.nl" class="text-white">mark.dekker@pbl.nl</a>.
				</p>
			</div>
		</div>
	</div>
	<!-- Main panel -->
	<main class="relative max-h-full flex-1 overflow-auto bg-base-100 p-4">
		<!-- TODO update page and remove info banner -->
		<div class="alert">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-6 w-6 shrink-0 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>This page is a work in progress. We will update it with more explanation soon</span>
		</div>
		<div class="prose absolute ml-4 max-w-[60%]">
			<h1>Frequently asked questions</h1>
			<section>
				<h2 id="scientific">Scientific basis</h2>
				<QA question="Where do the numbers on the global carbon budget come from?">
					The global carbon budget numbers are taken from Forster et al. (2023,
					https://essd.copernicus.org/articles/15/2295/2023/), who summarize updates of the WGI and
					WGIII reports of the IPCC, and updates of climate emulators. This paper directly reports
					CO2 budgets, but also the implied paths on non-CO2. The latter is used, augmented with
					information on cost-optimal global pathways from the AR6 database, to infer yearly total
					greenhouse gas emissions over the coming century.
				</QA>
				<QA question="How have these reference pathways come been determined?">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quis fugiat
					consequatur, maiores eius labore ad quidem, voluptas esse molestiae aspernatur aut magni
					neque laborum asperiores veritatis possimus ipsa dolor.
				</QA>
				<QA question="How reliable are the uncertainty estimates?">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quis fugiat
					consequatur, maiores eius labore ad quidem, voluptas esse molestiae aspernatur aut magni
					neque laborum asperiores veritatis possimus ipsa dolor.
				</QA>
				<QA question="What are these effort-sharing principles?">
					Links to Van der Berg et al. and Robiou. Picture of allocations.
					<img src="/paper_preview.png" alt="paper preview" />
				</QA>
				<QA question="How do you determine the countries' allocations?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="How is the assumption on negative emissions incorporated in the pathway?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
			</section>
			<section>
				<h2 id="societal">Societal relevance</h2>
				<QA question="Why do we need a tool like this?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="What is the intended audience for this tool?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="How to interpret these results?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="What is meant with the ambition and emission gaps?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="Why is the line for 'per capita' not connected to the historical emissions?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
			</section>
			<section>
				<h2 id="technology">Technological aspects</h2>
				<QA question="How does this website work?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="What model is used to calculate these pathways?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
				<QA question="Where can I report an issue?">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia a laudantium aliquid,
					exercitationem nostrum alias consectetur, distinctio dolor impedit commodi deserunt
					repellat, libero ab esse. Quae amet perspiciatis minima quod?
				</QA>
			</section>
		</div>
	</main>
</div>
