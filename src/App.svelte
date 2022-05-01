<script>
import "agnostic-svelte/css/common.min.css";
import { onMount } from "svelte";
import Router, { push } from "svelte-spa-router";
import Footer from "./lib/componentes/Footer.svelte";
import Header from "./lib/componentes/Header.svelte";
import LoaderFull from "./lib/componentes/LoaderFull.svelte";
import { routes } from "./lib/router";
import { loadUser } from "./lib/services/user";

let loaded = true;

onMount(async () => {
	await loadUser();
	loaded = false;
});
</script>

<Header />
<div class="wrapper">
	{#if loaded}
		<LoaderFull />
	{:else}
		<Router {routes} on:conditionsFailed={() => push("/")} />
	{/if}
</div>
<Footer />

<style>
	:root {
		--agnostic-btn-primary: var(--secundary-color);
		--agnostic-focus-ring-outline-color: var(--ring-color); 
	}
</style>

