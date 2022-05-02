<script>
import { Button, Dialog, Input, Loader, Select, Table } from "agnostic-svelte";
import { DateInput } from 'date-picker-svelte'
import { get } from "svelte/store";
import { getAllCountries } from "../../services/countries";
import { state } from "../../store";

let currentEvent;
let title = "";
let description = "";
let datetime = new Date();
let file = null;
let address = "";
let country = get(state)?.account?.country;


let submiting = false;
let userId = get(state)?.account?.$id;
let dialogInstance;

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    resetValues();
    dialogInstance?.show();
}

function asignFile(ev) {
    file = ev.target.files[0];
}

function resetValues() {
    // currentEvent = null;
    // race = "";
    // file = null;
    // description = "";
    // isPublic = false;
}

function createOrUpdate() {

}

</script>

<div class="p-1 container-white">
    <div class="controls-right">
        {#if userId}
            <Button mode="primary" type="button" on:click={openDialogForCreate}>Add</Button>
        {/if}
    </div>
</div>

<Dialog title="Add Event" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={createOrUpdate}>
        <div class="separator-field">
            <Input bind:value={title} label="Title" required/>
        </div>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" placeholder="" required />
        </div>
        <div class="separator-field select-label">
            <label for="date">
                <span>Datetime</span>
                <DateInput id="date" bind:value={datetime} />
            </label>
        </div>
        <div class="separator-field">
            <Input type="textarea" bind:value={address} label="Address" placeholder="" required />
        </div>
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
        <div class="separator-field">
            <Input  type="file" accept="image/*" on:change={asignFile} label="Image" placeholder="Image"  />
        </div>
        <div class="actions">
            <Button mode="primary" size="large" type="submit" isDisabled={submiting}>
                Acept 
                {#if submiting}
                 <Loader />
                {/if}
            </Button>
        </div>
    </form>
</Dialog>