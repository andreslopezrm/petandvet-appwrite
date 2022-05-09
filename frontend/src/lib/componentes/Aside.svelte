<script>
import { Card } from 'agnostic-svelte';
import {link} from 'svelte-spa-router';

export let showVeterinaries = true;
export let showEvents = true;
export let showTips = true;
export let showPets = true;
</script>
    
<aside>
    {#if showPets}
        <div class="mt-1">
            <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                <figure class="m16">
                    <a class="link-black main-icon" href="/" use:link>
                        🐶
                    </a>
                </figure>
                
                <h4>
                    <a href="/" use:link>Pets</a>
                </h4>
                
                <div class="m16">
                    <a class="link-black" href="/" use:link>
                        Meet pets from all over whose owners openly post to the world
                    </a>
                </div>
            </Card>
        </div>
    {/if}

    {#if showVeterinaries}
        <div class="mt-1">
            <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                <figure class="m16">
                    <a class="link-black main-icon" href="/veterinaries" use:link>
                        🏥
                    </a>
                </figure>
                
                <h4>
                    <a href="/veterinaries" use:link>Find a Veterinary</a>
                </h4>
                
                <div class="m16">
                    <a class="link-black" href="/veterinaries" use:link>
                        We have a directory of veterinarians with whom you can contact by specialties
                    </a>
                </div>
            </Card>
        </div>
    {/if}

    {#if showEvents}
        <div class="mt-1">
            <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                <figure class="m16">
                    <a class="link-black main-icon" href="/events" use:link>
                        📅 
                    </a>
                </figure>
                
                <h4>
                    <a href="/events" use:link>Events</a>
                </h4>
                
                <div class="m16">
                    <a class="link-black" href="/events" use:link>
                        We have a directory of veterinarians with whom you can contact by specialties
                    </a>
                </div>
            </Card>
        </div>
    {/if}

    {#if showTips}
        <div class="mt-1">
            <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                <figure class="m16">
                    <a class="link-black main-icon" href="/tips" use:link>
                        💡
                    </a>
                </figure>
                
                <h4>
                    <a href="/tips" use:link>Tips</a>
                </h4>
                
                <div class="m16">
                    <a class="link-black" href="/tips" use:link>
                        Get to know the different tips and experiences of other people
                    </a>
                </div>
            </Card>
        </div>
    {/if}
</aside>