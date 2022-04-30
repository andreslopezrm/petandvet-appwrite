<script>
import "agnostic-svelte/css/common.min.css";
import { onMount } from "svelte";
import Router, { push } from "svelte-spa-router";
import Footer from "./lib/componentes/Footer.svelte";
import Header from "./lib/componentes/Header.svelte";
import { routes } from "./lib/router";
import { loadUser } from "./lib/services/user";

onMount(() => {
	loadUser();
});
</script>

<Header />
<div class="wrapper">
	<Router {routes} on:conditionsFailed={() => push("/")} />
</div>
<Footer />

<style>
	:root {
		--agnostic-btn-primary: var(--secundary-color);
		--agnostic-focus-ring-outline-color: var(--ring-color); 
	}
</style>

