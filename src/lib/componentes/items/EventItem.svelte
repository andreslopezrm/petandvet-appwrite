<script>
import { Card } from "agnostic-svelte";
import {link} from 'svelte-spa-router';
import QrButton from "../common/QrButton.svelte";
import ShareButton from "../common/ShareButton.svelte";
export let event;
</script>

<Card css="mt-1">
    <div class="event-item">
        <figure class="event-item-figure">
            <img class="event-item-img" src={event.imageUrl} alt={event.title} />
        </figure>
        <div class="event-item-content">
            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <div class="event-item-actions">
                <a href={`/event/${event.$id}`} class="event-go-details" use:link>Details</a>
                <ShareButton link={`${window.location.href}#/event/${event.$id}`} />
                <QrButton text={`${window.location.href}#/event/${event.$id}`} />
            </div>
        </div>
    </div>
</Card>

<style>
    .event-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
    }

    .event-item-figure {
        flex: 1;
    }

    .event-item-img {
        max-width: 100%;
    }

    .event-item-content {
        flex: 2;
    }

    .event-item-actions {
        display: flex;
        margin-top: 1.1rem;
        gap: 0.5rem;
    }

    .event-go-details {
        background-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        border-color: var(--agnostic-btn-primary, var(--agnostic-primary));
        color: var(--agnostic-btn-primary-color, var(--agnostic-light));
        border-radius: var(--agnostic-radius-capsule);
        display: flex;
        align-items: center;
        padding: 0 1rem;
    }

    .event-go-details:hover {
        text-decoration: none;
    }
</style>
