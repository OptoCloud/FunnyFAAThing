<script lang="ts">
    import { onMount } from 'svelte';

    // Fetch data from https://explore.dot.gov/t/FAA/views/CommercialSpaceTransportation/LaunchLicenses?%3Aembed=y&%3AisGuestRedirectFromVizportal=y

    onMount(async () => {
        const response = await fetch('https://explore.dot.gov/t/FAA/views/CommercialSpaceTransportation/LaunchLicenses?%3Aembed=y&%3AisGuestRedirectFromVizportal=y');
        const data = await response.json();
        console.log(data);
    });
    

    let className = 'yes';
</script>

<div>
  <h1 class={className}>Page</h1>
</div>

<style>
    div {
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

    h1.yes {
        color: #00ff00;
    }
    h1.no {
        color: #ff0000;
    }
</style>