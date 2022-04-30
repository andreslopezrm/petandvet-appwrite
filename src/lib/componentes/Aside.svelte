<script>
    import { Card, Icon } from 'agnostic-svelte';
    import {link} from 'svelte-spa-router';
</script>
    
<aside>
    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
        <figure class="m16">
            <a class="link-black main-icon" href="/veterianries" use:link>
                🏥
            </a>
        </figure>
        
        <h4>
            <a href="/veterianries" use:link>Find a Veterinary</a>
        </h4>
        
        <div class="m16">
            <a class="link-black" href="/veterianries" use:link>
                We have a directory of veterinarians with whom you can contact by specialties
            </a>
        </div>
        </Card>

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
</aside>