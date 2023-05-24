import { countries } from '../../data';

/** @type {import('./$types').PageLoad} */
export function load() {
    return {
        countries
    };
}

export const prerender = true;
