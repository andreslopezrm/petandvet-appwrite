<script>
import { Button, Dialog, Input, Loader } from "agnostic-svelte";
import { createPet, getPets, updatePet } from "../../services/pets";
import { state } from "../../store";
import LoaderDots from "../LoaderDots.svelte";

let id = null;
let name = "";
let race = "";
let age = "";
let description = "";

let dialogInstance;
let pets = [];
let loading = true;
let userId;

state.subscribe(onSubscribeAccount)

async function onSubscribeAccount(data) {
    userId = data.account?.$id;
    if(userId) {
        //getPets(userId, 0, 1);
    }
}

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    id = null;
    dialogInstance?.show();
};

async function createOrUpdate() {
    console.log('entrer')
    if(id) {
    } else {
        const pet = await createPet({ userId, name, race, age, description });
        console.log(pet);
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
            <Input bind:value={age} label="Age" placeholder="For example: 3 months"  required />
        </div>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" placeholder="Color, weight, height, characteristics in general" required />
        </div>
        <div class="actions">
            <Button mode="primary" size="large" type="submit">
                Acept <Loader />
            </Button>
        </div>
    </form>
</Dialog>

