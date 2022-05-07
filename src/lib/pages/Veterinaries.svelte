<script>
import { Select } from 'agnostic-svelte';
import Aside from '../componentes/Aside.svelte';
import LoaderDots from '../componentes/LoaderDots.svelte';
import { getAllCountries } from '../services/countries';
import { get } from "svelte/store";
import { state } from "../store";
import { getEventsByCountry } from '../services/events';
import EventItem from '../componentes/items/EventItem.svelte';

let country = get(state)?.account?.country;
let events = [];
let loading = false;

$: if(country) {
    loadEvents();
}

async function loadEvents() {
    loading = true;
    events = await getEventsByCountry(country);
    loading = false;
}

</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">Find Veterianries</h2>
        <div class="mt-1">
            {#await getAllCountries()}
                <p>Loading countries</p>
            {:then countriesOptions} 
                <label for="country" class="select-label">
                    <span>Select a Country</span>
                    <Select
                        required 
                        uniqueId="country" 
                        bind:selected={country} 
                        options={countriesOptions} 
                        defaultOptionLabel=" - Select -"
                    />
                </label>
            {/await}
        </div>
        <div>
            {#if loading}
                <LoaderDots />
            {:else}
                {#if events.length === 0}
                    <p class="mt-1">Not events yet</p>
                {:else}
                    <div class="events-grid">
                        {#each events as event}
                            <EventItem event={event} />
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
    </section>
    <Aside showEvents={false} />
</main>

<style>
    .events-grid {
        margin-top: 2rem;
    }
</style>
        
        
        