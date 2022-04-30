<script>
import { Input, Select, Button, Close, Toasts, Toast  } from "agnostic-svelte";
import { onMount } from "svelte";
import { sdk } from "../../appwrite";
import Aside from "../componentes/Aside.svelte";

let countriesOptions = [];
let isToasErrorOpen = false
let name, lastName, email, password, country = "";

onMount(async () => {
    let { countries } = await sdk.locale.getCountries();
    countriesOptions = countries.map(({ name, code }) => ({ value: code, label: name })); 
})

function toastErrorClose() {
    isToasErrorOpen = false
}

function handleSubmit() {
    console.log(name, lastName, email, password, country)
    if(!country) {
        isToasErrorOpen = true;
        return;
    }
}

</script>
<main class="container mt-1">
    <section>
        <h2 class="big-title">Register</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <div class="sepatator">
                <Input bind:value={name} label="Name" required/>
            </div>
            <div class="sepatator">
                <Input bind:value={lastName} label="Lastname" />
            </div>
            <div class="sepatator">
                <Input bind:value={email} label="Email" type="email" required />
            </div>
            <div class="sepatator">
                <Input bind:value={password} label="Password" type="password" required />
            </div>
            <div class="select-wrapper">
                <label for="country" class="select-label">
                    <span>Select a Country</span>
                    <Select required uniqueId="country" bind:selected={country} options={countriesOptions} />
                </label>
            </div>
            <div class="actions">
                <Button mode="primary" size="large" type="submit">Acept</Button>
            </div>
        </form>
    </section>
    <Aside />
</main>

<Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
    <Toast isOpen={isToasErrorOpen} type="error">
        <div class="toast-error-content">
            <p>Select a country</p>
            <Close color="var(--agnostic-error-dark)" on:click={toastErrorClose} />
        </div>
    </Toast>
</Toasts>

<style >
    .sepatator {
        margin-bottom: 1rem;
    }
    .select-wrapper {
        margin: 1rem 0;
    }
    .actions {
        margin-top: 2rem;
    }
    .toast-error-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
</style>
