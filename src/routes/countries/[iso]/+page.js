import { error } from '@sveltejs/kit';
import { countries } from '../../../data';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const country = countries.find(country => country.iso === params.iso)
    if (!country) {
        throw error(404, 'Country not found')
    }
    return {
        country    
    };
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
    return countries.map(country => ({
        iso: country.iso
    }));
}

export const prerender = true;
