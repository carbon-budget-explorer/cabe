<!-- https://dev.to/learners/maps-with-d3-and-svelte-8p3 -->
<script>
    import { onMount } from 'svelte';
    import { json, select, geoPath, geoNaturalEarth1 } from  "d3";
    const d3 = { json, select, geoPath, geoNaturalEarth1 }

    let dataset = [];
    onMount(async () => {
        // const countriesURL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        const countriesURL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
        // const countriesURL = "/ne_110m_admin_0_countries.geojson"
        const countries = await json(countriesURL);
        dataset = countries.features;
    });

    const width = 1200;
    const height = 600;

    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);

    function handleMouseover(event) {
        d3.select(this).attr("fill", 'red')
        d3.select(this).attr("stroke-width", '1.5')
    }
    function handleMouseout(event) {
        d3.select(this).attr("fill", 'black')
        d3.select(this).attr("stroke-width", '0.5')

    }

</script>

<svg {width} {height}>
{#each dataset as data}
    <path
     d={path(data)}
     stroke="white"
     stroke-width="0.5"
     fill="black"
     on:mouseover={handleMouseover}
     on:focus={handleMouseover}
     on:mouseout={handleMouseout}
     on:blur={handleMouseout}
     />
     <!-- TODO: can we set attributes reactively? -->
     <!-- fill={geoContains(this, projection.invert(mouse)) ? "red" : "black"} -->
{/each}
</svg>
