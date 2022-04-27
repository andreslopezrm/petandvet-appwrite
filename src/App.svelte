<script>
	import Router, { push } from "svelte-spa-router";
import Header from "./lib/componentes/Header.svelte";
	import { routes } from './lib/router'
</script>

<Header />
<Router {routes} on:conditionsFailed={() => push("/")} />

