<script>
import { Card } from "agnostic-svelte";
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
                <a href={`/pet/${pet.$id}`} class="pet-go-details" use:link>Details</a>
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
    .pet-go-details {
        background-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        border-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        color: var(--agnostic-btn-primary-color, var(--agnostic-light));
        border-radius: var(--agnostic-radius-capsule);
        display: flex;
        align-items: center;
        padding: 0 1rem;
    }
    .pet-go-details:hover {
        text-decoration: none;
    }
</style>