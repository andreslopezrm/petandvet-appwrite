<script>
	import Router, { push } from "svelte-spa-router";
	import { routes } from './lib/router'
</script>

<Router {routes} on:conditionsFailed={() => push("/")} />

