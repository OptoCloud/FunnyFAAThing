<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    // Check if theres a license with "SpaceX" as operator
    const exists = data.licenses.some((license) => {
        const isSpaceX = license.operatorName === 'SpaceX';
        const containsBocaChica = license.siteName.includes('Boca Chica');
        const isMoreThanRev1 = license.licenseName.includes('Rev 3') || license.licenseName.includes('Rev 4');
        return isSpaceX && containsBocaChica && isMoreThanRev1;
    });
</script>

<div class="container m-auto p-4 flex flex-col justify-center items-center gap-10">
    <h2 class="h2">IFT-4 License Status</h2>
    <h1 class={'h1 ' + (exists ? 'text-green-500' : 'text-red-500')}>{exists ? 'OK' : 'Waiting'}</h1>
    <p>Updated: {data.lastUpdated.toLocaleString()}</p>
</div>