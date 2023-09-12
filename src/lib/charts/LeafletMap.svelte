<script lang="ts">
	import { LeafletMap, GeoJSON, TileLayer } from 'svelte-leafletjs?client';
	import type { BordersCollection } from '$lib/server/db/borders';
	import type { NamedSpatialMetric } from '$lib/server/db/utils';
	import 'leaflet/dist/leaflet.css';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import type { GeoJSONOptions, MapOptions } from 'leaflet';

	const dispatch = createEventDispatcher();
	export let borders: BordersCollection;
	export let metrics: NamedSpatialMetric[];

	const mapOptions: MapOptions = {
		center: [10, 0],
		zoom: 2,
		minZoom: 2
		// TODO when open street map is not shown render less gray background
	};

	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tileLayerOptions = {
		minZoom: 5,
		maxZoom: 20,
		maxNativeZoom: 19,
		attribution: '© OpenStreetMap contributors'
	};

	let tileLayer;

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

	function getMetric(feature: GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.GeoJsonProperties>) {
		return metrics.find((m) => m.ISO === feature.properties!.ISO_A3_EH);
	}

	const geoJsonOptions: GeoJSONOptions = {
		style: function (geoJsonFeature) {
			if (geoJsonFeature === undefined) {
				return {};
			}
			const value = getMetric(geoJsonFeature)?.value;
			const defaultOptions = { fillColor: 'grey', color: 'darkgrey', weight: 1 };
			if (value === undefined) {
				return defaultOptions;
			} else {
				return { ...defaultOptions, fillColor: getColor(value) };
			}
		}
		// TODO add tooltip
	};

	function onClick(e: any) {
		// <GeoJSON> dts says e is a LeafletMouseEvent but it is not
		// it is CustomEvent with e.detail being the LeafletMouseEvent
		const ISO = e.detail.sourceTarget.feature.properties.ISO_A3_EH;
		dispatch('goto', { ISO });
	}

	let leafletMap: LeafletMap;

	// @types/svelte-leafletjs is missing GeoJSON.data property
	// use any to avoid type errors,
	// see https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
	const notypecheck = (x: any) => x;
</script>

<div class="h-full w-full">
	{#if browser}
		<LeafletMap bind:this={leafletMap} options={mapOptions}>
			<TileLayer bind:this={tileLayer} url={tileUrl} options={tileLayerOptions} />
			<GeoJSON
				{...notypecheck({ borders })}
				options={geoJsonOptions}
				events={['click']}
				on:click={onClick}
			/>
		</LeafletMap>
	{/if}
</div>
