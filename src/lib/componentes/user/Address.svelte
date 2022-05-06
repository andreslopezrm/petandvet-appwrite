<script>
import { Button, Dialog, Input, Loader, Select, Table } from "agnostic-svelte";
import { onMount, setContext } from "svelte";
import { createAddress, updateAddress, deleteAddress, getAddress } from "../../services/address";
import { state } from "../../store";
import ToastMultiple from "../ToastMultiple.svelte";
import Confirm from "../Confirm.svelte";
import { getAllCountries } from "../../services/countries";
import LoaderDots from "../LoaderDots.svelte";
import CellActions from "../cells/CellActions.svelte";

let currentAddress;
let addresses = [];

let account;
let userId;

state.subscribe(data => {
    account = data.account;
    userId = account.$id;
});

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
    rows = addresses.map(({ description, phone  }, index) => ({ description, phone, index  }))
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
    country = address.country;
    phone = address.phone;
    latitude = address.latitude;
    longitude = address.longitude;
}


function detectLocation() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
        latitude = coords.latitude;
        longitude = coords.longitude;
    });
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
        await deleteAddress(currentAddress.$id);
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

{#if account}
    <div class="address">
        <div class="address-controls-right">
            {#if userId}
                <h4>Addresses</h4>
                <Button isLink type="button" size="smalll" on:click={openDialogForCreate}>Add</Button>
            {/if}
        </div>
        <div>
            {#if loading}
                <LoaderDots />
             {:else}
                 {#if rows.length}
                     <Table
                         caption="Yours address"
                         rows={rows}
                         headers={[
                             {
                                 label: "Description",
                                 key: "description",
                             },
                             {
                                 label: "Phone",
                                 key: "phone"
                             },
                             {
                                 label: "Actions",
                                 key: "index",
                                 renderComponent: () => CellActions
                             }
                         ]}
                     />
                 {:else}
                     <p class="empty-state">🏢 <i>No address yet</i></p>
                 {/if}
            {/if}
         </div>
    </div>
{/if}

<Dialog title="Add Address" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={createOrUpdate}>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" required/>
        </div>
        <div class="select-wrapper">
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
        </div>
        <div class="separator-field">
            <Input bind:value={phone} label="Phone"/>
        </div>
        <div class="separator-field address-input-multiple address-input-bottom">
            <Input bind:value={latitude} label="Latitude" />
            <Input bind:value={longitude} label="Logitude" />
            {#if navigator.geolocation}
                <Button on:click={detectLocation}>📍</Button>
            {/if}
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
    .address-input-multiple {
        display: flex;
        gap: 1rem;
    }
    .address-input-bottom {
        align-items: flex-end;
    }
</style>