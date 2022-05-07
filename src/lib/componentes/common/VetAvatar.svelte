<script>
import { onMount } from "svelte";

import { getAvatarUrl } from "../../services/info";


export let veterinary;
let imageUrl;

onMount(generate);

async function generate() {
    if(veterinary?.imageUrl) {
        imageUrl = veterinary?.imageUrl;
    } else {
        imageUrl = await getAvatarUrl(veterinary);
    }
}
</script>

{#if imageUrl}
    <figure class="vet-avatar-figure">
        <img class="vet-avatar-img" width="68" src={imageUrl} alt={veterinary?.name ?? ""} />
    </figure>
{/if}

<style>
    .vet-avatar-img {
        border-radius: 50%;
    }
</style>