<script>
import { Card, Button } from "agnostic-svelte";
import {link} from 'svelte-spa-router';
import QrButton from "../common/QrButton.svelte";
import ShareButton from "../common/ShareButton.svelte";
export let pet;
</script>

<Card>
    <div class="pet-item">
        {#if pet.imageUrl}
            <figure>
                <img class="pet-item-img" src={pet.imageUrl} alt={pet.name} />
            </figure>
            <div class="pet-item-actions">
                <Button mode="primary" isCapsule>Details</Button>
                <ShareButton link={`${window.location.href}#/pet/${pet.$id}`} />
                <QrButton text={pet.name} />
            </div>
        {/if}
    </div>
</Card>

<style>
    .pet-item {
        padding: 1.1rem;
    }
    .pet-item-img{
        max-width: 100%;
    }
    .pet-item-actions {
        display: flex;
        margin-top: 0.5rem;
        gap: 0.5rem;
        justify-content: flex-end;
    }
</style>