<script lang="ts">
  import { page } from '$app/stores';
    import type { PageData } from './$types';

    $: query = $page.url.searchParams;
    $: operator = query.get('operator')?.toLocaleLowerCase() ?? null;
    $: site = query.get('site')?.toLocaleLowerCase() ?? null;
    $: includes = query.get('includes')?.toLocaleLowerCase() ?? null;
    $: title = query.get('title') ?? 'License Status';
    $: successMessage = query.get('success_msg') ?? 'OK';
    $: failureMessage = query.get('failure_msg') ?? 'Waiting';

    export let data: PageData;

    // Check if theres a license with "SpaceX" as operator
    $: exists = data.licenses.some((license) => {
        if (operator !== null && license.operatorName.toLocaleLowerCase() !== operator) {
            return false;
        }
        if (site !== null && !license.siteName.toLocaleLowerCase().includes(site)) {
            return false;
        }
        if (includes !== null && !license.licenseName.toLocaleLowerCase().includes(includes)) {
            return false;
        }
        return true;
    });
</script>

<div class="container m-auto p-4 flex flex-col justify-center items-center gap-10">
    <h2 class="h2">{title}</h2>
    <h1 class={'h1 ' + (exists ? 'text-green-500' : 'text-red-500')}>{exists ? successMessage : failureMessage}</h1>
    <p>Updated: {data.lastUpdated.toLocaleString()}</p>
</div>