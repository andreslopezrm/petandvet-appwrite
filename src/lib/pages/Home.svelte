<script>
import Aside from '../componentes/Aside.svelte';
import PetItem from '../componentes/items/PetItem.svelte';
import LoaderDots from '../componentes/LoaderDots.svelte';
import { getPublicPets } from '../services/pets';
</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">Last photo pets</h2>
        <div class="mt-1">
            {#await getPublicPets()}
                <LoaderDots />
            {:then pets} 
                <div class="pets-grid mt-1">
                    {#each pets as pet}
                        <PetItem pet={pet} />
                    {/each}
                </div>
            {/await}
        </div>
    </section>
    <Aside showPets={false} />
</main>

<style>
    .pets-grid {
        display: grid;
        gap: 1rem;
    }
    @media (min-width: 600px) {
        .pets-grid {
            grid-template-columns: auto auto;
        }
    }

    @media (min-width: 800px) {
        .pets-grid {
            grid-template-columns: auto auto auto;
        }
    }
</style>


