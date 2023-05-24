<script>
	import { each } from "svelte/internal";
    import Tabs from '$lib/Tabs.svelte';
    import Map from '$lib/Map.svelte';

	const strategies = [
        {code: 'GF', description: 'Grandfathering'},
        {code: 'PC', description: 'Per capita'},
        {code: 'PCC', description: 'Per capita convergence'},
        {code: 'AP', description: 'Ability to pay'},
        {code: 'GDR', description: 'Greenhouse development rights'},
        {code: 'ECPC', description: 'Equal cumulative per capita'},
    ]

    let activeStrategy = 'GF';
    const handleClick = code => () => (activeStrategy = code);
</script>

<h1>FAIR Carbon Budget Explorer</h1>
<p>Pick your effort-sharing principle</p>

<Tabs {strategies} bind:value={activeStrategy} />
<h1>{activeStrategy}</h1>
<Map />
