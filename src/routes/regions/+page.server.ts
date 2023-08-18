import { borders } from '$lib/server/db/data';
import { listRegions } from '$lib/server/db/models';

export async function load() {
	const regionIsos = listRegions();
	const regions = borders.addNames(regionIsos.map((ISO) => ({ ISO })));
	return { regions };
}
