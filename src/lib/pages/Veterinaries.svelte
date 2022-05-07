<script>
import { Select } from "agnostic-svelte";
import Aside from "../componentes/Aside.svelte";
import LoaderDots from "../componentes/LoaderDots.svelte";
import { getAllCountries } from "../services/countries";
import { get } from "svelte/store";
import { state } from "../store";
import VeterinaryItem from "../componentes/items/VeterinaryItem.svelte";
import { getAllVeterianriesByCountry } from "../services/veterianries";

let country = get(state)?.account?.country;
let veterianries = [];
let loading = false;

$: if(country) {
    loadEvents();
}

async function loadEvents() {
    loading = true;
    veterianries = await getAllVeterianriesByCountry(country);
    console.log(country);
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
                {#if veterianries.length === 0}
                    <p class="mt-1">Not veterianries yet</p>
                {:else}
                    <div class="events-grid">
                        {veterianries.length}
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
        
        
        