<script>
import { Input, Select } from "agnostic-svelte";
import { onMount } from "svelte";
import { sdk } from "../../appwrite";
import Aside from "../componentes/Aside.svelte";

let countriesOptions = []

onMount(async () => {
    let { countries } = await sdk.locale.getCountries();
    countriesOptions = countries.map(({ name, code }) => ({ value: code, label: name })); 
})

</script>
<main class="container mt-1">
    <section>
        <h2 class="big-title">Register</h2>
        <form>
            <div class="sepatator">
                <Input label="Name" />
            </div>
            <div class="sepatator">
                <Input label="Lastname" />
            </div>
            <div class="sepatator">
                <Input label="Email" />
            </div>
            <div class="sepatator">
                <Input label="Password" />
            </div>
            <div class="sepatator">
                <Select  defaultOptionLabel="- Select a country -" options={countriesOptions} />
            </div>
        </form>
    </section>
    <Aside />
</main>

<style>
    .sepatator {
        margin-bottom: 1rem;
    }
</style>
