<script>
import Aside from '../componentes/Aside.svelte';
import TipItem from '../componentes/items/TipItem.svelte';
import LoaderDots from '../componentes/LoaderDots.svelte';
import { getAllTips } from '../services/tips';


</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">Tips</h2>
        <div class="mt-1">
            {#await getAllTips()}
                <LoaderDots />
            {:then tips} 
                <div class="tips-grid mt-1">
                    {#if tips.length === 0}
                        <p>No tips yet</p>
                    {:else}
                        {#each tips as tip}
                            <TipItem tip={tip} />
                        {/each}
                    {/if}
                </div>
            {/await}
        </div>
    </section>
    <Aside showTips={false} />
</main>

<style>
    @media (min-width: 500px) {
        .tips-grid {
            display: grid;
            grid-template-columns: auto auto;
            gap: 1rem;
        }
    }
</style>
    