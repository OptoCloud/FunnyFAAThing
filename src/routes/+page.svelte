<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    let className = 'No';
</script>

<div>
  <h1 class={className}>{className}</h1>
  <p>{JSON.stringify(data.faa_data)}</p>
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

    h1.Yes {
        color: #00ff00;
    }
    h1.No {
        color: #ff0000;
    }
</style>