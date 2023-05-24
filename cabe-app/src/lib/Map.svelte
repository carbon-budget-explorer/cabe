<!-- https://dev.to/learners/maps-with-d3-and-svelte-8p3 -->
<script>
    import { geoPath, geoNaturalEarth1 } from  "d3";

    const width = 1200;
    const height = 600;

    const projection = geoNaturalEarth1();
    const path = geoPath(projection);

    import { json } from  "d3";
    // const countriesURL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    const countriesURL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    let dataset = [];
    json(countriesURL).then((data) => {
        dataset = data.features;
    })

</script>

<svg {width} {height}>
{#each dataset as data}
    <path d={path(data)} />
{/each}

</svg>

<style>
    path {
        stroke:white;
    }
</style>
