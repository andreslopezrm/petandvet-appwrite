<script>
import { Button, Dialog, Input, EmptyState } from "agnostic-svelte";
import { createPet, getPets, updatePet } from "../../services/pets";
import { state } from "../../store";

let id = null;
let name = "";
let race = "";
let age = "";
let description = "";

let dialogInstance;
let pets = [];
let userId;

state.subscribe(onSubscribeAccount)

async function onSubscribeAccount(data) {
    userId = data.account?.$id;
    if(userId) {
        //pets = await getPets(userId, 0, 1);
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
        <Button mode="primary" type="button" on:click={openDialogForCreate}>Add</Button>
    </div>
    <div>
       {#if pets.length === 0}
            <p class="empty-state"> 
                📥 <i>No pets yet</i>
            </p>
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
            <Button mode="primary" size="large" type="submit">Acept</Button>
        </div>
    </form>
</Dialog>

