<script lang="ts">
	import { LeafletMap, GeoJSON } from 'svelte-leafletjs?client';
	import type { BordersCollection } from '$lib/server/db/borders';
	import type { NamedSpatialMetric } from '$lib/server/db/utils';
	import 'leaflet/dist/leaflet.css';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import type { GeoJSONOptions, LeafletMouseEvent } from 'leaflet';

	const dispatch = createEventDispatcher();
	export let borders: BordersCollection;
	export let metrics: NamedSpatialMetric[];

	const mapOptions = {
		zoom: 2
	};

    // TODO use d3 scale instead
	function getColor(d: number) {
		return d > 10000
			? '#800026'
			: d > 5000
			? '#BD0026'
			: d > 2000
			? '#E31A1C'
			: d > 1000
			? '#FC4E2A'
			: d > 500
			? '#FD8D3C'
			: d > 200
			? '#FEB24C'
			: d > 100
			? '#FED976'
			: '#FFEDA0';
	}

	const geoJsonOptions: GeoJSONOptions = {
		style: function (geoJsonFeature) {
            if (geoJsonFeature === undefined) {
                return {}
            }
			const value = metrics.find((m) => m.ISO === geoJsonFeature.properties.ISO_A3_EH)?.value;
			if (value === undefined) {
				return { fillColor: 'grey' };
			} else {
				return { fillColor: getColor(value) };
			}
		}
	};

	function onClick(e: LeafletMouseEvent) {
		const ISO = e.detail.sourceTarget.feature.properties.ISO_A3_EH;
        dispatch('goto', {ISO});
	}

	let leafletMap: LeafletMap;
</script>

<div class="h-full w-full">
	{#if browser}
		<LeafletMap bind:this={leafletMap} options={mapOptions}>
			<GeoJSON data={borders} options={geoJsonOptions} events={['click']} on:click={onClick} />
		</LeafletMap>
	{/if}
</div>
