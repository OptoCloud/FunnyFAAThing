<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    // Check if theres a license with "SpaceX" as operator
    let exists = data.faa_data.data.some((license) => {
        const isSpaceX = license.operatorName === 'SpaceX';
        const containsBocaChica = license.siteName.includes('Boca Chica');
        const isMoreThanRev1 = license.licenseName.includes('Rev 2') || license.licenseName.includes('Rev 3');
        return isSpaceX && containsBocaChica && isMoreThanRev1;
    });

    let className = exists ? 'Yes' : 'No';
</script>

<div class="container">
    <div>
        <h1 class="title">Has SpaceX received the IFT-3 launch license modification yet?</h1>
        <h1 class={className}>{className}</h1>
        <table>
            <tr>
                <th>Licence</th>
                <th>Operator</th>
                <th>Location</th>
                <th>Site/State</th>
                <th>Vehicle</th>
            </tr>
            {#each data.faa_data.data as license (license.licenseName)}
                <tr>
                    <td><a href={license.licenseUrl}>{license.licenseName}</a></td>
                    <td>{license.operatorName}</td>
                    <td>{license.locationName}</td>
                    <td>{license.siteName}</td>
                    <td>{license.vehicleName}</td>
                </tr>
            {/each}
        </table>
        <p>Updated: {new Date(data.faa_data.date).toLocaleString()}</p>
    </div>
</div>

<style>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #222222;
    }
    .container div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1.title {
        color: #ffffff;
    }

    h1.Yes {
        color: #00ff00;
    }
    h1.No {
        color: #ff0000;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        text-align: center;
        color: #ffffff;
    }

    p {
        color: #ffffff;
    }
</style>