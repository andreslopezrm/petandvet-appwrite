<script>
import { Button, Dialog, Input, Loader, Table } from "agnostic-svelte";
import { onMount } from "svelte";
import { get } from "svelte/store";
import { createPet, getPets, updatePet } from "../../services/pets";
import {  uploadPetPhoto } from "../../services/upload";
import { state } from "../../store";
import LoaderDots from "../LoaderDots.svelte";
import ToastMultiple from "../ToastMultiple.svelte";

let id = null;
let name = "";
let race = "";
let file = null;
let description = "";

let dialogInstance;
let pets = [];
let rows = []
let userId = get(state)?.account?.$id;

let loading = true;
let submiting = false;
let successMessage;
let errorMessage;


$: {
    rows = pets.map(({ name, race, description, isPublic }) => ({ name, race, description, isPublic  }))
}

onMount(async () => {
    pets = await getPets(userId);
    loading = false;
})


function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    id = null;
    dialogInstance?.show();
};

function closeDialog() {
    dialogInstance?.hide();
}

function asignFile(ev) {
    file = ev.target.files[0];
}


async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(id) {

        } else {
            const { imageId, imageUrl } = await uploadPetPhoto(file);
            await createPet({ userId, name, race, description, imageId, imageUrl });
            successMessage = "Pet create success";
        }
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
    <div>
       {#if loading}
           <LoaderDots />
        {:else}
            {#if rows.length}
                <Table
                    caption="Yours pets"
                    rows={rows}
                    headers={[
                        {
                            label: "Name",
                            key: "name"
                        },
                        {
                            label: "Race",
                            key: "race"
                        },
                        {
                            label: "Description",
                            key: "description"
                        },
                        {
                            label: "Public",
                            key: "isPublic"
                        }
                    ]}
                />
            {:else}
                <p class="empty-state">🐶 <i>No pets yet</i></p>
            {/if}
       {/if}
    </div>
</div>

<Dialog title="Add Pet" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={createOrUpdate}>
        <div class="separator-field">
            <Input bind:value={name} label="Name" required/>
        </div>
        <div class="separator-field">
            <Input bind:value={race} label="Race" placeholder="For example: dog" required />
        </div>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" placeholder="Color, age, weight, height, characteristics in general" required />
        </div>
        <div class="separator-field">
            <Input  type="file" accept="image/*" on:change={asignFile} label="Image" placeholder="Image" required />
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



