<script>
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

export let users = [];

function handleSelect() {
    dispatch('select', { text: 'Hello!' });
}

</script>

<div>
    <button type="button" on:click={handleSelect}>Enviar</button>
</div>

