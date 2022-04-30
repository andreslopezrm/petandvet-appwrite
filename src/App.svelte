<script>
import 'agnostic-svelte/css/common.min.css'
import Router, { push } from 'svelte-spa-router'
import Footer from './lib/componentes/Footer.svelte'
import Header from './lib/componentes/Header.svelte'
import { routes } from './lib/router'
</script>

<Header />
<main class="wrapper">
	<Router {routes} on:conditionsFailed={() => push("/")} />
</main>
<Footer />

<style>
	main {
		--agnostic-btn-primary: var(--secundary-color);
		--agnostic-focus-ring-outline-color: var(--ring-color); 
	}
</style>

