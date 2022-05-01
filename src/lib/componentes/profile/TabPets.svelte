<script>
import { Button, Dialog, Input, Loader } from "agnostic-svelte";
import { get } from "svelte/store";
import { createPet, getPets, updatePet } from "../../services/pets";
import {  uploadPetPhoto } from "../../services/upload";
import { state } from "../../store";
import LoaderDots from "../LoaderDots.svelte";

let id = null;
let name = "";
let race = "";
let age = "";
let file = null;
let description = "";

let dialogInstance;
let pets = [];
let userId = get(state)?.account?.$id;

let loading = true;
let submiting = false;
let successMessage;
let errorMessage;


function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    id = null;
    dialogInstance?.show();
};

function asignFile(ev) {
    file = ev.target.files[0];
}

async function createOrUpdate() {
    submiting = true
    try {
        if(id) {

        } else {
            const image = await uploadPetPhoto(file);
            const pet = await createPet({ userId, name, race, description, image });
            console.log(pet);
        }
    } catch(err) {

    } finally {
        submiting = false
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

