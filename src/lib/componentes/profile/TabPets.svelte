<script>
import { Button, Dialog, Input, Loader, Table } from "agnostic-svelte";
import { onMount, setContext } from "svelte";
import { get } from "svelte/store";
import { createPet, deletePet, getPets, updatePet } from "../../services/pets";
import { deletePhoto, uploadPetPhoto } from "../../services/upload";
import { state } from "../../store";
import LoaderDots from "../LoaderDots.svelte";
import ToastMultiple from "../ToastMultiple.svelte";
import CellImage from "../cells/CellImage.svelte";
import CellActions from "../cells/CellActions.svelte";
import Confirm from "../Confirm.svelte";

let currentPet = null;
let name = "";
let race = "";
let file = null;
let description = "";
let isPublic = false;

let dialogInstance;
let pets = [];
let rows = []
let userId = get(state)?.account?.$id;

let loading = true;
let submiting = false;
let successMessage;
let errorMessage;
let openConfirm;


$: {
    rows = pets.map(({ imageUrl, name, race, description, isPublic }, index) => ({ imageUrl, name, race, description, isPublic, index  }))
}

onMount(loadPets)

async function loadPets() {
    loading = true;
    pets = await getPets(userId);
    loading = false;
}


function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function openDialogForCreate() {
    resetValues();
    dialogInstance?.show();
}

function openDialogForEdit(index) {
    const pet = pets[index];
    asignValues(pet);
    dialogInstance?.show();
}


function closeDialog() {
    dialogInstance?.hide();
}

function openConfirmForDelete(index) {
    const pet = pets[index];
    currentPet = pet;
    openConfirm = true;
}

function closeConfirm() {
    openConfirm = false;
}

function asignFile(ev) {
    file = ev.target.files[0];
}

function resetValues() {
    currentPet = null;
    name = "";
    race = "";
    file = null;
    description = "";
    isPublic = false;
}

function asignValues(pet) {
    currentPet = pet;
    name = pet.name;
    race = pet.race;
    description = pet.description;
    isPublic = pet.isPublic;
}

async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(currentPet) {
            let photo;

            if(file) {
                photo = await uploadPetPhoto(file);
                await deletePhoto(currentPet.imageId);
            }
            const id = currentPet.$id;
            const imageId = photo?.imageId ?? currentPet.imageId;
            const imageUrl = photo?.imageUrl ?? currentPet.imageUrl;

            await updatePet({ id, name, race, description, imageId, imageUrl, isPublic });
            successMessage = "Pet update success";
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

async function remove() {
    submiting = true;
    try {
        await deletePet(currentPet.$id);
        currentPet = null;
        openConfirm = false;
        await loadPets();
        successMessage = "Pet delete success";
    } catch(err) {
        errorMessage = err.message;
    } finally {
        submiting = false;
    }
}

setContext('onEdit', openDialogForEdit);
setContext('onDelete', openConfirmForDelete);

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
                            label: "Image",
                            key: "imageUrl",
                            renderComponent: () => CellImage
                        },
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
                        },
                        {
                            label: "Actions",
                            key: "index",
                            renderComponent: () => CellActions
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
            {#each ["dog", "cat", "bird", "fish", "reptile", "other"] as type}
                <label class="radio-field">
                    <input type=radio bind:group={race} name="race" value={type}>
                    <span>{type}</span>
                </label>
            {/each}
        </div>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" placeholder="Color, age, weight, height, characteristics in general" required />
        </div>
        <div class="separator-field">
            <Input  type="file" accept="image/*" on:change={asignFile} label="Image" placeholder="Image"  />
        </div>
        <div class="separator-field">
            <label class="radio-field">
                <input type=checkbox bind:checked={isPublic} name="isPublic">
                <span>is public?</span>
            </label>
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

<Confirm 
    message="Delete sure?" 
    open={openConfirm}
    onClose={closeConfirm}
    onAccept={remove}
    submiting={submiting}
/>



