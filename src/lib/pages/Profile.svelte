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
                Profile 
            </h2>
            <Button type="button" isLink on:click={closeSession}>Logout</Button>
        </div>
        
        <div class="container-tabs">
            <Tabs tabindex={0} size="large" tabs={[
                {
                    title: "👩‍🚀 Info",
                    ariaControls: "panel-4",
                    tabPanelComponent: TabInfo,
                    tabindex: 3
                },
                {
                    title: "💡 Tips",
                    ariaControls: "panel-3",
                    tabPanelComponent: TabTips,
                    tabindex: 2
                },
                {
                    title: "🗓 Events",
                    ariaControls: "panel-2",
                    tabPanelComponent: TabEvents,
                    tabindex: 1
                },
                {
                    title: "🐕 Pets",
                    ariaControls: "panel-1",
                    tabPanelComponent: TabPets,
                    tabindex: 0
                },
            ]} />
        </div>
    </section>
</main>

<style>
    .container-tabs {
        margin-top: 1.5rem;
        --agnostic-tabs-primary: var(--secundary-color);
    }
    .container-header {
        display: flex;
        justify-content: space-between;
    }
</style>