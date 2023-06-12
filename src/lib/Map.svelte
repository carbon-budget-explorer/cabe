<!-- https://dev.to/learners/maps-with-d3-and-svelte-8p3 -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { geoPath, geoNaturalEarth1, scaleLog, extent } from  "d3";
	import type { Metric } from './metrics';

    export let metrics: Metric[]
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

    const domain = extent(metrics.map(metric => metric.GDP));
    const range = ["red", "white", "green"];
    const scale = scaleLog()
        .domain(domain)
        .range(range);

    function fillColor(code: string) {
        // TODO find out why not all countries are in metrics
        const metric = metrics.find(metric => metric.ISO === code);
        if (metric === undefined) {
            return 'fill: black';
        }
        return `fill: ${scale(metric.GDP)}`
    }
</script>

<p>Active country: {activeCountry}</p>
<svg>
    {#each dataset as data}
    <path
    d={path(data)}
    data-name={data.properties.ISO_A3}
    style={fillColor(data.properties.ISO_A3)} 
     on:mouseover={handleMouseover}
     on:focus={handleMouseover}
     />
{/each}
<defs>
<!-- From https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients 
TODO replace with https://observablehq.com/@d3/color-legend in svelte format
-->
    <linearGradient id="Gradient2" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color={range[0]} />
      <stop offset="50%" stop-color={range[1]} stop-opacity="0" />
      <stop offset="100%" stop-color={range[2]} />
    </linearGradient>
  </defs>

  <rect fill="url(#Gradient2)" x="10" y="10" rx="15" ry="15" width="500" height="30" />
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
