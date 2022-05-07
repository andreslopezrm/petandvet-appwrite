<script>
import { Button } from "agnostic-svelte";


export let cellValue;
</script>

<a class="view-in-map-link" href={cellValue} target="_blank">View in map</a>

<style>
    .view-in-map-link {
        color: var(--agnostic-btn-primary, var(--agnostic-primary));
    }
</style>