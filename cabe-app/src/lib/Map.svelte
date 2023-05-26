<!-- https://dev.to/learners/maps-with-d3-and-svelte-8p3 -->
<script>
    import { onMount } from 'svelte';
    import { geoPath, geoNaturalEarth1 } from  "d3";

    let dataset = [];
    onMount(async () => {
        // const countriesURL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        const countriesURL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
        // const countriesURL = "/ne_110m_admin_0_countries.geojson"
        const countries = await fetch(countriesURL);
        const countries_json = await countries.json()
        console.log(countries_json)
        dataset = countries_json.features;
    });

    const projection = geoNaturalEarth1().scale(150);
    const path = geoPath(projection);
    let activeCountry = '';

    function handleMouseover(event) {
        activeCountry = this.dataset.name
    }

</script>

<p>Active country: {activeCountry}</p>
<svg>
{#each dataset as data}
    <path
     d={path(data)}
     data-name={data.properties.ISO_A3}
     on:mouseover={handleMouseover}
     on:focus={handleMouseover}
     />
{/each}
</svg>

<style>
    svg {
        width: 1200px;
        height: 600px;
    }
    path {
        stroke: white;
        stroke-width: 0.5;
        fill: black;
    }
    path:hover {
        fill: red;
        stroke-width: 2.5;
    }
</style>
