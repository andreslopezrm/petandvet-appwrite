<script>
import { Button, Dialog, Input, Loader, Select, Table } from "agnostic-svelte";
import { DateInput } from 'date-picker-svelte'
import { get } from "svelte/store";
import { getAllCountries } from "../../services/countries";
import { state } from "../../store";
import ToastMultiple from "../ToastMultiple.svelte";

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

let successMessage;
let errorMessage;
let openConfirm;

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
    currentEvent = null;
    title = "";
    description = "";
    datetime = new Date();
    file = null;
    address = "";
    country = get(state)?.account?.country;
}

async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(currentEvent) {
            // let photo;

            // if(file) {
            //     photo = await uploadPetPhoto(file);
            //     await deletePhoto(currentPet.imageId);
            // }
            // const id = currentPet.$id;
            // const imageId = photo?.imageId ?? currentPet.imageId;
            // const imageUrl = photo?.imageUrl ?? currentPet.imageUrl;

            // await updatePet({ id, name, race, description, imageId, imageUrl, isPublic });
            // successMessage = "Pet update success";
        } else {
            const { imageId, imageUrl } = await uploadPetPhoto(file);
            await createPet({ userId, name, race, description, imageId, imageUrl, isPublic });
            successMessage = "Pet create success";
        }
        resetValues();
        loadPets();
    } catch(err) {
        errorMessage = err.message;
    } finally {
        submiting = false
        closeDialog();
    }
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

<ToastMultiple
    successMessage={successMessage} 
    errorMessage={errorMessage}
    onCloseSuccessMessage={_ => { successMessage = null }}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>