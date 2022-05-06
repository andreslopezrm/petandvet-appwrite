<script>
import { Card } from 'agnostic-svelte';

import { params } from 'svelte-spa-router'
import Aside from '../componentes/Aside.svelte';
import QrButton from '../componentes/common/QrButton.svelte';
import ShareButton from '../componentes/common/ShareButton.svelte';
import LoaderDots from '../componentes/LoaderDots.svelte';
import ToastMultiple from '../componentes/ToastMultiple.svelte';
import { getPublicPet } from '../services/pets';

let loading = true;
let pet;
let errorMessage;

params.subscribe(load);

async function load(data) {
    if(!data?.petId || pet) {
        return;
    }

    try {
        pet = await getPublicPet(data.petId);
    } catch(err) {
        errorMessage = false;
    } finally {
        loading = false;
    }
}
</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">Pet</h2>
        <div class="mt-1">
            {#if loading}
                <LoaderDots />
            {:else}
                <div class="pet-container">
                    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                        <figure class="pet-figure">
                            <img class="pet-img" src={pet.imageUrl} alt={pet.name} />
                        </figure>
                    </Card>
                    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                        <div class="pet-content">
                            <p class="pet-element">
                                <strong>Name</strong>: {pet.name}
                            </p>
                            <p class="pet-element">
                                <strong>Race</strong>: 
                                <span class="pet-race">{pet.race}</span>
                            </p>
                            <p class="pet-element">
                                <strong>Description</strong>: {pet.description}
                            </p>
                            <div class="pet-actions">
                                <ShareButton isPrimary={true} link={`${window.location.href}#/pet/${pet.$id}`} />
                                <QrButton text={pet.name} />
                            </div>
                        </div>
                    </Card>
                </div>
            {/if}
        </div>
    </section>
    <Aside showPets={false} />
</main>

<ToastMultiple
    errorMessage={errorMessage}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>

<style>
    .pet-container {
        gap: 1rem;
    }

    
    .pet-img {
        padding: 1rem;
        max-width: 100%;
    }

    .pet-element {
        margin-bottom: 1rem;
    }

    .pet-content {
        padding: 1rem 1.5rem;
        text-align: left;
        width: 100%;
    }

    .pet-actions {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .pet-race {
        text-transform: capitalize;
    }

    @media (min-width: 600px) {
        .pet-container {
            display: flex;
        }
    }

</style>
