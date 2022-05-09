<script>
import { Card } from "agnostic-svelte";
import {link} from 'svelte-spa-router';
import QrButton from "../common/QrButton.svelte";
import ShareButton from "../common/ShareButton.svelte";
import VetAvatar from "../common/VetAvatar.svelte";


export let veterinary;
</script>

<Card css="mt-1">
    <div class="veterinary-item">
        <figure class="veterinary-item-figure">
            <VetAvatar veterinary={veterinary} />
        </figure>
        <div class="veterinary-item-content">
            <h4>{veterinary.name}</h4>
            <p>{veterinary.email}</p>

            <div class="veterinary-item-actions">
                <a href={`/veterinary/${veterinary.$id}`} class="veterinary-go-details" use:link>Details</a>
                <ShareButton link={`${window.location.href}#/veterinary/${veterinary.$id}`} />
                <QrButton text={`${window.location.href}#/veterinary/${veterinary.$id}`} />
            </div>
        </div>
    </div>
</Card>

<style>
    .veterinary-item {
        padding: 1rem;
        display: flex;
        gap: 1rem;
    }

    .veterinary-item-actions {
        margin-top: 1.6rem;
    }

    .veterinary-item-actions {
        display: flex;
        margin-top: 0.5rem;
        gap: 0.5rem;
    }

    .veterinary-go-details {
        background-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        border-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        color: var(--agnostic-btn-primary-color, var(--agnostic-light));
        border-radius: var(--agnostic-radius-capsule);
        display: flex;
        align-items: center;
        padding: 0 1rem;
    }
    .veterinary-go-details:hover {
        text-decoration: none;
    }
</style>
