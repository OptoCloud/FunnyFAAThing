<script lang="ts">
    import TwitterSummaryTags from '$lib/metadata/Twitter/TwitterSummaryTags.svelte';
    import OpenGraphTags from '$lib/metadata/OpenGraphTags.svelte';
    import type { PageData } from './$types';
    import { page } from '$app/stores';

    export let data: PageData;

    const licenses = data.licenses ?? [];
    const lastUpdated = data.lastUpdated ?? new Date();
    const error = data.error ?? null as string | null;

    // Check if theres a license with "SpaceX" as operator
    const exists = licenses.some((license) => {
        const isSpaceX = license.operatorName === 'SpaceX';
        const containsBocaChica = license.siteName.includes('Boca Chica');
        const isMoreThanRev1 = license.licenseName.includes('Rev 3') || license.licenseName.includes('Rev 4');
        return isSpaceX && containsBocaChica && isMoreThanRev1;
    });

    const title = 'SpaceX IFT-4 License Status';
    const description = 'Has SpaceX received the IFT-4 launch license modification yet?';

    const successMessage = 'YES!!!\nIS POINTY END UP??';
    const failureMessage = 'Not Yet';
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<TwitterSummaryTags type="summary" {title} {description} />
<OpenGraphTags type="website" {title} {description} url={$page.url.origin} />

<div class="container m-auto p-4 flex flex-col justify-center items-center gap-10">
    {#if !error}
        <h2 class="h2">{description}</h2>
        <h1 class={'h1 ' + (exists ? 'text-green-500' : 'text-red-500')}>{exists ? successMessage : failureMessage}</h1>
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
                {#each licenses as license (license.licenseName)}
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
        <p>Updated: {lastUpdated.toLocaleString()}</p>
    {:else}
        <h2 class="h2 text-red-500">Error</h2>
        <p class="text-red-500">{error}</p>
    {/if}
</div>