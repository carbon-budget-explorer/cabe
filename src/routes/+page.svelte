<script lang="ts">
	import logo from '$lib/logo.svg';
	export const prerender = true;
</script>

<main class="grid grid-cols-2 content-around gap-20 bg-base-200 p-40">
	<div class="flex h-full flex-row">
		<img src={logo} class="h-full" alt="Logo for Carbon Budget Explorer" />
		<div class="text-6xl font-bold">
			<div>Carbon</div>
			<div>Budget</div>
			<div>Explorer</div>
		</div>
	</div>
	<a class="btn-primary btn-lg btn self-center rounded-lg" href="/global">
		Start exploring &raquo;
	</a>

	<div class="prose">
		<h2>How much should my country contribute to climate change mitigation?</h2>
		<p>
			This is a core question to many policymakers, scientists, and stakeholders of climate change.
			Even though many countries pledged the implementation of policies to reduce their emissions,
			it is not enough, as shown in the recent <a
				href="https://www.unep.org/resources/emissions-gap-report">UNEP emission gap report</a
			>: there is still lots of additional ambition needed to close the gap. However, who should
			step up? Is it the rich countries, because they have the means to do so? Or the countries that
			have emitted a lot in the past? Clearly, there is no single answer, because it depends on what
			you think is fair. However, these principles can be quantified. That is where the Carbon
			Budget Explorer comes in.
		</p>
	</div>
	<div class="prose">
		<h2>Exploring the consequences of your ideas on fairness and climate targets</h2>
		<p>
			This free, open-source interactive webtool calculates the consequences of your choices on the
			targets that you want to achieve, and what you think is fair. It provides insights in how much
			we can emit as a globe, but also the allocations that each country would get in every year
			during the rest of the century. The numbers are based on the calculations from the most recent
			scientific research in this field. We encourage you to play around with the results and be
			confronted with the consequences of your choices. For any questions, please feel free to <a
				href="/about#contact">contact us</a
			>.
		</p>
	</div>

	<div class="prose col-span-2 justify-self-center">
		<h1 class="text-center text-8xl">🞃</h1>
		<h2>Steps</h2>
		In order to answer these questions, the webtool contains three core steps:
		<ol>
			<li>
				<h3>Determine the carbon budget and global pathway</h3>
				<p>As mentioned earlier, the first step is the determination of the</p>
			</li>
			<li>
				<h3>Allocate among the countries</h3>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut illum hic nihil illo odio
					eos ducimus, deleniti commodi ullam nesciunt architecto recusandae laborum ex quis impedit
					rerum. Exercitationem, deleniti repellendus!
				</p>
			</li>
			<li>
				<h3>Observe individual country results</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni delectus molestiae quas.
					Id quam, ullam vero itaque cupiditate ipsa. Tempore nobis nulla, ducimus non ipsam autem
					quas qui. Atque, recusandae.
				</p>
			</li>
		</ol>
		<h2>Want to know more?</h2>
		<p>For more information, we refer to the About page, and the scientific paper.</p>
	</div>
</main>
