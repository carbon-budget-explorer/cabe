<script lang="ts">
	import { LeafletMap, GeoJSON, TileLayer } from 'svelte-leafletjs?client';
	import type { BordersCollection } from '$lib/server/db/borders';
	import type { NamedSpatialMetric } from '$lib/server/db/utils';
	import 'leaflet/dist/leaflet.css';
	import { browser } from '$app/environment';
	import type { GeoJSONOptions, MapOptions } from 'leaflet';
	import { interpolatePuOr, interpolateRdBu, scaleSequential } from 'd3';
	import ColorLegend from './components/ColorLegend.svelte';

	export let borders: BordersCollection;
	export let metrics: NamedSpatialMetric[];

	const mapOptions: MapOptions = {
		center: [30, 5],
		zoom: 3,
		minZoom: 2,
		zoomControl: false
		// TODO when open street map is not shown render less gray background
	};

	const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.{ext}';
	const tileLayerOptions = {
		minZoom: 4,
		maxZoom: 20,
		maxNativeZoom: 19,
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		ext: 'png',
		subdomains: 'abcd'
	};

	let tileLayer;

	$: domain = [0, 5_000];
	$: colormap = interpolatePuOr;
	$: scale = scaleSequential()
		.clamp(true)
		.domain(domain) // 0.8 dampens sensitivy outliers
		.interpolator(colormap); // TODO configurable colormap?

	function getColor(d: number) {
		return scale(d);
	}
	// TODO Deal with nans?
	// TODO add colorbar

	function getMetric(
		feature: GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.GeoJsonProperties>,
		metrics: NamedSpatialMetric[]
	) {
		return metrics.find((m) => m.ISO === feature.properties!.ISO_A3_EH);
	}

	const geoJsonOptions: GeoJSONOptions = {
		style: function (geoJsonFeature) {
			if (geoJsonFeature === undefined) {
				return {};
			}
			const value = getMetric(geoJsonFeature, metrics)?.value;
			const defaultOptions = { fillColor: 'grey', color: 'darkgrey', weight: 1 };
			if (value === undefined) {
				return defaultOptions;
			} else {
				return { ...defaultOptions, fillColor: getColor(value), fillOpacity: 0.8 };
			}
		}
	};

	export let selectedFeature:
		| GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.GeoJsonProperties>
		| undefined;

	function onClick(e: any) {
		selectedFeature = e.detail.sourceTarget.feature;
		// <GeoJSON> dts says e is a LeafletMouseEvent but it is not
		// it is CustomEvent with e.detail being the LeafletMouseEvent
	}

	let leafletMap: LeafletMap;

	// @types/svelte-leafletjs is missing GeoJSON.data property
	// use any to avoid type errors,
	// see https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
	const notypecheck = (x: any) => x;
</script>

<div class="h-full w-full" id="leaflet-wrapper">
	{#if browser}
		<LeafletMap bind:this={leafletMap} options={mapOptions}>
			<TileLayer bind:this={tileLayer} url={tileUrl} options={tileLayerOptions} />
			<GeoJSON
				{...notypecheck({ data: borders })}
				options={geoJsonOptions}
				events={['click', 'mouseover', 'mouseout']}
				on:click={onClick}
			/>
		</LeafletMap>
		<ColorLegend title={'Gt CO₂'} {...notypecheck({ scale: scale })} {scale} />
	{/if}
</div>

<style>
	:global(.leaflet-container) {
		background-color: transparent;
	}
</style>
