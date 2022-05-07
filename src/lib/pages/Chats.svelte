<script>
import { Button, Tabs } from "agnostic-svelte";
import { replace } from "svelte-spa-router";
import TabPets from "../componentes/profile/TabPets.svelte";
import TabEvents from "../componentes/profile/TabEvents.svelte";
import TabTips from "../componentes/profile/TabTips.svelte";
import TabInfo from "../componentes/profile/TabInfo.svelte";
import { logout } from "../services/user";

async function closeSession() {
    await logout();
    replace("/");
}
</script>

<main class="container mt-1">
    <section>
        <div class="container-header">
            <h2 class="big-title">
                Chats 
            </h2>
        </div>
        
    </section>
</main>