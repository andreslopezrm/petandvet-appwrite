<script>
import { Input, Select, Button, Close, Toasts, Toast  } from "agnostic-svelte";
import { onMount } from "svelte";
import { sdk } from "../../appwrite";
import Aside from "../componentes/Aside.svelte";
import { state } from "../store";

let countriesOptions = [];
let isToastCountryOpen = false
let isToastKindOpen = false
let fullname = "";
let email = "";
let password = "";
let country = "";
let kind = "";

onMount(async () => {
    let { countries } = await sdk.locale.getCountries();
    countriesOptions = countries.map(({ name, code }) => ({ value: code, label: name })); 
})

function toastCountryClose() {
    isToastCountryOpen = false
}

function toastKindClose() {
    isToastKindOpen = false
}

async function handleSubmit() {
    
    // if(!country) {
    //     isToastCountryOpen = true;
    //     return;
    // }

    // if(!kind) {
    //     isToastKindOpen = true;
    //     return;
    // }

    // try {
    //     const account = await sdk.account.create('unique()', email, password, fullname);
    //     const usermeta = await sdk.database.createDocument('usermeta', 'unique', {
    //         userId: account.$id,
    //         country,
    //         kind
    //     });

    //     const session = await sdk.account.createSession(email, password);
    // } catch(err) {
    //     console.log(err);
    // }
    
}

</script>
<main class="container mt-1">
    <section>
        <h2 class="big-title">Register</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <div class="sepatator">
                <Input bind:value={fullname} label="Full Name" required/>
            </div>
            <div class="sepatator">
                <Input bind:value={email} label="Email" type="email" required />
            </div>
            <div class="sepatator">
                <Input bind:value={password} label="Password" type="password" required minlength="8" />
            </div>
            <div class="select-wrapper">
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
    <Toast isOpen={isToastCountryOpen} type="error">
        <div class="toast-error-content">
            <p>Select a country</p>
            <Close color="var(--agnostic-error-dark)" on:click={toastCountryClose} />
        </div>
    </Toast>

    <Toast isOpen={isToastKindOpen} type="error">
        <div class="toast-error-content">
            <p>Select a kind</p>
            <Close color="var(--agnostic-error-dark)" on:click={toastKindClose} />
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
