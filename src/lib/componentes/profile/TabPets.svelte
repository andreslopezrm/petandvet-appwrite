<script>
import { get } from "svelte/store";
import { Button, Dialog, Input } from "agnostic-svelte";
import { createPet, updatePet } from "../../services/pets";
import { state } from "../../store";

let id = null;
let name = "";
let race = "";
let age = "";
let description = "";

let dialogInstance;

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    id = null;
    dialogInstance?.show();
};

function createOrUpdate() {
    const userId = get(state).account.$id;
    console.log(userId);
    if(id) {
        updatePet();
    } else {
        createPet({ userId, name, race, age, description })
    }
}

</script>

<div class="p-1 container-white">
    <div class="controls-right">
        <Button mode="primary" type="button" on:click={openDialogForCreate}>Add</Button>
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

