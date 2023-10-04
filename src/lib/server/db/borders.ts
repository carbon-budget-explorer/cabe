import { readFile, stat } from 'node:fs/promises';

export interface BorderProperties {
	ISO_A3_EH: string;
	ISO_A2_EH: string;
	NAME: string;
}

export async function open_borders(fn: string) {
	const content = await readFile(fn, { encoding: 'utf8' });
	const stats = await stat(fn);
	const lastModified = new Date(stats.mtimeMs);
	const geojson = JSON.parse(content);
	return new Borders(geojson, lastModified);
}

export type BordersCollection = GeoJSON.FeatureCollection<null, BorderProperties>;

export class Borders {
	public labels = new Map<string, string>();
	constructor(public geojson: BordersCollection, public lastModified: Date) {
		for (const feature of geojson.features) {
			const iso = feature.properties.ISO_A3_EH;
			const iso2 = feature.properties.ISO_A2_EH;
			const label = feature.properties.NAME;
			feature.properties = {
				ISO_A3_EH: iso,
				ISO_A2_EH: iso2,
				NAME: label
			};
			this.labels.set(iso, label);
		}
	}

	addNames<T extends { ISO: string }>(items: T[]): (T & { name: string })[] {
		return items.map((m) => {
			return {
				...m,
				name: this.labels.get(m.ISO) || m.ISO
			};
		});
	}
}
