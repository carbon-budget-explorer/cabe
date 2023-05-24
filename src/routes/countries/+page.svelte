<script>
	import Chloropleth from '../../lib/Chloropleth.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>Countries</h1>

<Chloropleth features={data.countries} />
<ul>
	{#each data.countries as country}
		<li><a href="/countries/{country.iso}">{country.name}: {country.population}</a></li>
	{/each}
</ul>
