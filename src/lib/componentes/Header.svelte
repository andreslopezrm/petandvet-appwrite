<script>
import {link} from "svelte-spa-router";
import { state } from "../store";
</script>

<nav>
    <div class="container header">
        <h1>
            <a href="/" use:link> 🐾 🧑‍⚕️ Pet And Vet</a>
        </h1>
        {#await $state.account }
            <span />
        {:then account } 
           {#if account }
            <div>
                <a href="/profile" use:link> ℹ️ My Profile</a>
            </div>
           {/if}

           {#if !account}
            <div>
                <a href="/register" use:link> Register </a> 
                <span class="text-white"> | </span>
                <a href="/login" use:link> Login </a>
            </div> 
           {/if}
        {/await}
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