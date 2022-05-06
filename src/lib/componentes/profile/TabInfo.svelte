<script>
import { Button, Input, Select, Loader } from "agnostic-svelte";
import Avatar from "../user/Avatar.svelte";
import { state } from "../../store";
import { updateInfoName, updateInfoGeneral, updateInfoPassword, updateInfoEmailPassword } from "../../services/info";
import LoaderDots from "../LoaderDots.svelte";
import { getAllCountries } from "../../services/countries";
import ToastMultiple from "../ToastMultiple.svelte";
import { loadUser } from "../../services/user";
import FieldEdit from "../user/FieldEdit.svelte";
import Address from "../user/Address.svelte";

let account;
let submiting = false;
let successMessage;
let errorMessage;

state.subscribe(data => {
    account = data.account;
});

async function handleSubmitGeneral() {
    submiting = true;
    successMessage = null;
    errorMessage = null;
    try {
        const { metaId, country, kind } = account;
        await updateInfoName(account.name);
        await updateInfoGeneral({ metaId, country, kind  });
        await loadUser();
        successMessage = "Info updated";
    } catch(err) {
        errorMessage = err.message;
    } finally {
        submiting = false;
    }
}


</script>
<div class="p-1 container-white">
    {#if account}
        <Avatar />
        <div class="info-container">
            <form on:submit|preventDefault={handleSubmitGeneral}>
                <div class="separator-field">
                    <Input bind:value={account.name} label="Full Name" required />
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
                                bind:selected={account.country} 
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
                            bind:selected={account.kind} 
                            options={[
                                { value: 'owner', label: 'Owner'},
                                { value: 'veterinary', label: 'Veterinary'}
                            ]} 
                        />
                    </label>
                </div>
                <div class="actions">
                    <Button mode="primary" size="large" type="submit" isDisabled={submiting}>
                        Acept
                        <Loader />
                    </Button>
                </div>
            </form>
            {#if account.kind === "veterinary"}
                <div class="info-address">
                    <Address />
                </div>
            {/if}
            <div class="info-access">
                <h4>Access</h4>
                <FieldEdit 
                    label="Email" 
                    property="email" 
                    type="email"
                    onEdit={updateInfoEmailPassword}
                />   
                <FieldEdit 
                    label="Password" 
                    property="password" 
                    type="password"
                    onEdit={updateInfoPassword}
                /> 
            </div>   
        </div>
    {:else}
        <LoaderDots />
    {/if}
</div>

<ToastMultiple 
    successMessage={successMessage} 
    errorMessage={errorMessage}
    onCloseSuccessMessage={_ => { successMessage = null }}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>

<style>
    .info-container {
        max-width: 700px;
        margin: 0 auto;
        padding-top: 1rem;
    }

    .info-access {
        margin-top: 2.5rem;
    }
    .info-address {
        margin: 3.4rem 0;
    }
</style>