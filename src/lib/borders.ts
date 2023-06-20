import { readFile } from 'node:fs/promises';

interface BorderProperties {
    ISO_A3: string;
    FORMAL_EN: string;
}

const borders = new Map<string, BorderProperties>()

async function load() {
    if (borders.size > 0) {
        return
    }
    const fn = 'static/country_borders.geojson'
    const content = await readFile(fn, { encoding: 'utf8' })
    const geojson = JSON.parse(content)
    for (const feature of geojson.features) {
        const iso = feature.properties.ISO_A3_EH
        borders.set(iso, feature.properties)
    }
}

export async function countryName(iso: string) {
    await load()
    const properties = borders.get(iso)
    if (properties === undefined) {
        throw new Error(`Unknown country ISO code ${iso}`)
    }
    return properties.FORMAL_EN
}   