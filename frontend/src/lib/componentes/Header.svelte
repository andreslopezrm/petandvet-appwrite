<script>
import { onMount } from "svelte";
import { link } from "svelte-spa-router";
import { fade } from 'svelte/transition';
import { state } from "../store";

let isShowMenu = false;
let account = null;

function visibleMenu() {
    isShowMenu = true;
}

onMount(() => {
    setTimeout(visibleMenu, 600);
})

state.subscribe((data) => {
    account = data?.account;
})

</script>

<nav>
    <div class="container header">
        <h1>
            <a href="/" use:link> 🐾 🧑‍⚕️ Pet And Vet</a>
        </h1>
            {#if isShowMenu}
                <div transition:fade="{{  duration: 300 }}">
                    {#if account}
                        <a href="/profile" use:link> ℹ️ My Profile</a>
                    {/if}

                    {#if !account}
                    <a href="/register" use:link> Register </a> 
                    <span class="text-white"> | </span>
                    <a href="/login" use:link> Login </a>
                    {/if}
                </div>
            {/if}
    </div>
</nav>

<style>
    nav {
        padding: 1rem;
        background: var(--primary-color);
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
    }

    h1 {
        margin: 0;
        padding: 0;
    }

    a {
        color: var(--font-color-ligth);
        text-decoration: none;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }
</style>