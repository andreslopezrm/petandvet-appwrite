<script>
import { Input, Select, Button, Close, Toasts, Toast  } from "agnostic-svelte";
import { replace } from "svelte-spa-router";
import Aside from "../componentes/Aside.svelte";
import { createUser } from "../services/user";
import { getAllCountries } from "../services/countries";

let isToastOpen = false
let errorMessage = "";
let fullname = "";
let email = "";
let password = "";
let country = "";
let kind = "";


function toastClose() {
    errorMessage = "";
    isToastOpen = false
}

function toastOpen(message) {
    errorMessage = message;
    isToastOpen = true;
}


async function handleSubmit() {

    errorMessage = "";
    isToastOpen = false;
    
    if(!country) {
        toastOpen("Select a country");
        return;
    }

    if(!kind) {
        toastOpen("Select a kind");
        return;
    }

    try {
        await createUser({ fullname, email, password, country, kind });
        replace("/profile");
    } catch(err) {
        toastOpen(err.message);
    }
    
}

</script>
<main class="container mt-1">
    <section>
        <h2 class="big-title">Register</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <div class="separator-field">
                <Input bind:value={fullname} label="Full Name" required/>
            </div>
            <div class="separator-field">
                <Input bind:value={email} label="Email" type="email" required />
            </div>
            <div class="separator-field">
                <Input bind:value={password} label="Password" type="password" required minlength="8" />
            </div>
            <div class="select-wrapper">
                {#await getAllCountries()}
                    <p>Loading countries</p>
                {:then countriesOptions} 
                    <label for="country" class="select-label">
                        <span>Select a Country</span>
                        <Select 
                            required 
                            uniqueId="country" 
                            bind:selected={country} 
                            options={countriesOptions} 
                            defaultOptionLabel=" - Select -"
                        />
                    </label>
                {/await}
            </div>
            <div class="select-wrapper">
                <label for="kind" class="select-label">
                    <span>Select a Kind</span>
                    <Select 
                        required 
                        uniqueId="kind" 
                        bind:selected={kind} 
                        options={[
                            { value: 'owner', label: 'Owner'},
                            { value: 'veterinary', label: 'Veterinary'}
                        ]} 
                    />
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
    <Toast isOpen={isToastOpen} type="error">
        <div class="toast-content">
            <p>{errorMessage}</p>
            <Close color="var(--agnostic-error-dark)" on:click={toastClose} />
        </div>
    </Toast>
</Toasts>