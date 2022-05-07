<script>
import { Card } from 'agnostic-svelte';
import { params } from 'svelte-spa-router'
import Aside from '../componentes/Aside.svelte';
import QrButton from '../componentes/common/QrButton.svelte';
import ShareButton from '../componentes/common/ShareButton.svelte';
import LoaderDots from '../componentes/LoaderDots.svelte';
import ToastMultiple from '../componentes/ToastMultiple.svelte';
import { getEvent } from '../services/events';
import { getFlag  } from '../services/countries';
import { getDateFormatLarge } from '../services/date';

let loading = true;
let event;
let errorMessage;

params.subscribe(load);

async function load(data) {
    if(!data?.eventId || event) {
        return;
    }

    try {
        event = await getEvent(data.eventId);
    } catch(err) {
        errorMessage = false;
    } finally {
        loading = false;
    }
}
</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">Event</h2>
        <div class="mt-1">
            {#if loading}
                <LoaderDots />
            {:else}
                <div class="event-container">
                    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                        <figure class="event-figure">
                            <img class="event-img" src={event.imageUrl} alt={event.title} />
                        </figure>
                    </Card>
                    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                        <div class="event-details">
                            <p>
                                <strong>Title:</strong> {event.title}
                            </p>
                            <p>
                                <strong>Description:</strong> {event.description}
                            </p>
                            <p>
                                <strong>Date:</strong> {getDateFormatLarge(event.date)}
                            </p>
                            <p>
                                <strong>Address:</strong> {event.address}
                            </p>
                            <p>
                                <strong>Country: </strong>
                                {#await getFlag(event.country)}
                                    <span>{event.country}</span>
                                {:then resource} 
                                    <img width="20" src={resource.href} alt={event.title} />
                                {/await}
                            </p>
                            <div class="event-item-actions">
                                <ShareButton isPrimary link={`${window.location.href}#/event/${event.$id}`} />
                                <QrButton text={`${window.location.href}#/event/${event.$id}`} />
                            </div>
                        </div>
                    </Card>
                </div>
            {/if}
        </div>
    </section>
    <Aside showEvents={false} />
</main>

<ToastMultiple
    errorMessage={errorMessage}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>

<style>

    .event-container {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .event-details {
        padding: 1rem 1.5rem;
        text-align: left;
    }

    .event-details p {
        margin-bottom: 0.5rem;
    }

    .event-figure {
        padding: 1rem;
    }

    .event-img {
        width: 100%;
    }

    .event-item-actions {
        margin-top: 0.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.8rem;
    }
</style>
    