<script>
import { Button, Dialog, Input, Loader, Select, Table } from "agnostic-svelte";
import { DateInput } from 'date-picker-svelte'
import { get } from "svelte/store";
import { getAllCountries } from "../../services/countries";
import { state } from "../../store";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../services/events";
import { deleteEventPhoto, uploadEventPhoto } from "../../services/upload";
import ToastMultiple from "../ToastMultiple.svelte";
import { onMount, setContext } from "svelte";
import LoaderDots from "../LoaderDots.svelte";
import CellImage from "../cells/CellImage.svelte";
import CellActions from "../cells/CellActions.svelte";
import CellDate from "../cells/CellDate.svelte";
import Confirm from "../Confirm.svelte";


let currentEvent;
let title = "";
let description = "";
let datetime = new Date();
let file = null;
let address = "";
let country = get(state)?.account?.country;

let loading = true;
let submiting = false;
let userId = get(state)?.account?.$id;
let dialogInstance;

let events = [];
let rows = [];
let successMessage;
let errorMessage;
let openConfirm;

$: {
    rows = events.map(({ imageUrl, title, description, address, datetime }, index) => ({ imageUrl, title, description, address, datetime, index }));
}

onMount(loadEvents);

async function loadEvents() {
    loading = true;
    events = await getEvents(userId);
    loading = false;
}

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
}

function openDialogForCreate() {
    resetValues();
    dialogInstance?.show();
}

function openDialogForEdit(index) {
    const event = events[index];
    asignValues(event);
    dialogInstance?.show();
}

function closeDialog() {
    dialogInstance?.hide();
}

function openConfirmForDelete(index) {
    const event = events[index];
    currentEvent = event;
    openConfirm = true;
}

function closeConfirm() {
    openConfirm = false;
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

function asignValues(event) {
    currentEvent = event;
    title = event.title;
    description = event.description;
    datetime = new Date(event.datetime);
    file = null;
    address = event.address;
    country = event.country;
}

async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(currentEvent) {
            let photo;

            if(file) {
                photo = await uploadEventPhoto(file);
                await deleteEventPhoto(currentEvent.imageId);
            }
            const id = currentEvent.$id;
            const imageId = photo?.imageId ?? currentEvent.imageId;
            const imageUrl = photo?.imageUrl ?? currentEvent.imageUrl;

            await updateEvent({ id, title, description, imageId, imageUrl, address, country, datetime: +datetime });
            successMessage = "Event update success";
        } else {
            const { imageId, imageUrl } = await uploadEventPhoto(file);
            await createEvent({ userId, title, description, imageId, imageUrl, address, country, datetime: +datetime });
            successMessage = "Pet create success";
        }
        resetValues();
        loadEvents();
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
        await deleteEvent(currentEvent.$id);
        await deleteEventPhoto(currentEvent.imageId);
        currentEvent = null;
        openConfirm = false;
        await loadEvents();
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
                     caption="Yours events"
                     rows={rows}
                     headers={[
                         {
                             label: "Image",
                             key: "imageUrl",
                             renderComponent: () => CellImage
                         },
                         {
                             label: "Title",
                             key: "title"
                         },
                         {
                             label: "Description",
                             key: "description"
                         },
                         {
                             label: "Address",
                             key: "address"
                         },
                         {
                             label: "Date",
                             key: "datetime",
                             renderComponent: () => CellDate
                         },
                         {
                             label: "Actions",
                             key: "index",
                             renderComponent: () => CellActions
                         }
                     ]}
                 />
             {:else}
                 <p class="empty-state">⏱ <i>No events yet</i></p>
             {/if}
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

<Confirm
    message="Delete sure?" 
    open={openConfirm}
    onClose={closeConfirm}
    onAccept={remove}
    submiting={submiting}
/>



