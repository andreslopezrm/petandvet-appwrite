<script>
import { Button, Dialog, Input, Loader, Table } from "agnostic-svelte";
import { onMount, setContext } from "svelte";
import { createAddress, updateAddress, deleteAddress, getAddress } from "../../services/address";
import { get } from "svelte/store";
import { state } from "../../store";
import ToastMultiple from "../ToastMultiple.svelte";
import Confirm from "../Confirm.svelte";

let currentAddress;
let addresses = [];

let account = get(state)?.account;
let userId = account.$id;

let description;
let country = account?.country;
let phone;
let latitude;
let longitude;

let dialogInstance;
let rows = [];

let loading = true;
let submiting = false;
let successMessage;
let errorMessage;
let openConfirm;

$: {
    rows = addresses.map(({ description, country, phone  }, index) => ({ description, country, phone, index  }))
}


onMount(loadAddresses);

async function loadAddresses() {
    loading = true;
    addresses = await getAddress(userId);
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
    const address = addresses[index];
    asignValues(address);
    dialogInstance?.show();
}


function closeDialog() {
    dialogInstance?.hide();
}

function openConfirmForDelete(index) {
    const address = addresses[index];
    currentAddress = address;
    openConfirm = true;
}

function closeConfirm() {
    openConfirm = false;
}

function resetValues() {
    currentAddress = null;
    description = "";
    country = account?.country;
    phone = "";
    latitude = "";
    longitude = "";
}

function asignValues(address) {
    currentAddress = address;
    description = address.description;
    country = aaddress.country;
    phone = address.phone;
    latitude = address.latitude;
    longitude = address.longitude;
}

async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(currentAddress) {
            const id = currentAddress.$id;

            await updateAddress({ id, description, country, latitude, longitude, phone });
            successMessage = "Address update success";
        } else {
            await createAddress({ userId, description, country, latitude, longitude, phone });
            successMessage = "Address create success";
        }
        resetValues();
        loadAddresses();
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
        await deleteAddress(currentPet.$id);
        currentAddress = null;
        openConfirm = false;
        await loadAddresses();
        successMessage = "Address delete success";
    } catch(err) {
        errorMessage = err.message;
    } finally {
        submiting = false;
    }
}

setContext('onEdit', openDialogForEdit);
setContext('onDelete', openConfirmForDelete);

</script>

<div class="address">
    <div class="address-controls-right">
        {#if userId}
            <h4>Addresses</h4>
            <Button isLink type="button" size="smalll" on:click={openDialogForCreate}>Add</Button>
        {/if}
    </div>
</div>

<Dialog title="Add Pet" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={createOrUpdate}>
        <div class="separator-field">
            <Input bind:value={description} label="Description" required/>
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

<style>
    .address {
        margin-top: 2rem;
    }

    .address-controls-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>