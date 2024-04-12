import type { LicensesApiResponse } from '$lib/types/LicensesApiResponse';
import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`/api/licenses.json`);
    if (!res.ok) {
        return {
            error: 'Failed to fetch licenses, please try again later or contact the developer.'
        };
    }

    const data = await res.json() as LicensesApiResponse;
    return {
        lastUpdated: new Date(data.date),
        licenses: data.data
    }
};