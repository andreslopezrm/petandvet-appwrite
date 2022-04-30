<script>
    import { Tabs } from "agnostic-svelte";
    import TabPets from "../componentes/profile/TabPets.svelte";
    import TabEvents from "../componentes/profile/TabEvents.svelte";
    import TabTips from "../componentes/profile/TabTips.svelte";
    import TabInfo from "../componentes/profile/TabInfo.svelte";
</script>

<main class="container mt-1">
    <section>
        <h2 class="big-title">
            Profile 
        </h2>

        <div class="container-tabs">
            <Tabs size="large" tabs={[
                {
                    title: "Pets",
                    ariaControls: "panel-1",
                    tabPanelComponent: TabPets,
                },
                {
                    title: "Events",
                    ariaControls: "panel-2",
                    tabPanelComponent: TabEvents,
                },
                {
                    title: "Tips",
                    ariaControls: "panel-3",
                    tabPanelComponent: TabTips,
                },
                {
                    title: "Info",
                    ariaControls: "panel-4",
                    tabPanelComponent: TabInfo,
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
</style>