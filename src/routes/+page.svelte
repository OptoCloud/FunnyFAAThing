<script lang="ts">
    import TwitterSummaryTags from '$lib/metadata/Twitter/TwitterSummaryTags.svelte';
    import OpenGraphTags from '$lib/metadata/OpenGraphTags.svelte';
import type { PageData } from './$types';
  import { page } from '$app/stores';

    export let data: PageData;

    // Check if theres a license with "SpaceX" as operator
    let exists = data.faa_data.data.some((license) => {
        const isSpaceX = license.operatorName === 'SpaceX';
        const containsBocaChica = license.siteName.includes('Boca Chica');
        const isMoreThanRev1 = license.licenseName.includes('Rev 2') || license.licenseName.includes('Rev 3');
        return isSpaceX && containsBocaChica && isMoreThanRev1;
    });
</script>

<svelte:head>
    <title>SpaceX IFT-3 License Status</title>
</svelte:head>

<TwitterSummaryTags type="summary" title="SpaceX IFT-3 License Status" description="Has SpaceX received the IFT-3 launch license modification yet?" />
<OpenGraphTags type="website" title="SpaceX IFT-3 License Status" description="Has SpaceX received the IFT-3 launch license modification yet?" url={$page.url.origin} />

<div class="container m-auto p-4 flex flex-col justify-center items-center gap-10">
    <h2 class="h2">Has SpaceX received the IFT-3 launch license modification yet?</h2>
    <h1 class="h1 text-green-500">YES!!! IS POINTY END UP??</h1>
    <div class="w-full h-[400px] md:h-[500px] overflow-y-auto table-container md:text-base">
        <table class="table table-hover">
        <thead>
            <tr>
                <th>Licence</th>
                <th>Operator</th>
                <th>Vehicle</th>
                <th>Site</th>
                <th>State/Location</th>
            </tr>
        </thead>
        <tbody>
            {#each data.faa_data.data as license (license.licenseName)}
                <tr>
                    <td><a class="text-blue-500 underline" href={license.licenseUrl}>{license.licenseName}</a></td>
                    <td>{license.operatorName}</td>
                    <td>{license.vehicleName}</td>
                    <td>{license.siteName}</td>
                    <td>{license.locationName}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    </div>
    <p>Updated: {new Date(data.faa_data.date).toLocaleString()}</p>
</div>