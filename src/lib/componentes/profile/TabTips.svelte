<script>
import { Button, Dialog, Input, Loader, Table } from "agnostic-svelte";
import { onMount, setContext } from "svelte";
import { get } from "svelte/store";
import { createTip, deleteTip, getTips, updateTip } from "../../services/tips";
import { state } from "../../store";
import LoaderDots from "../LoaderDots.svelte";
import ToastMultiple from "../ToastMultiple.svelte";
import CellActions from "../cells/CellActions.svelte";
import Confirm from "../Confirm.svelte";

let currentTip = null;
let description = "";


let dialogInstance;
let tips = [];
let rows = []
let userId = get(state)?.account?.$id;

let loading = true;
let submiting = false;
let successMessage;
let errorMessage;
let openConfirm;


$: {
    rows = tips.map(({ description }, index) => ({ description, index }))
}

onMount(loadTips)

async function loadTips() {
    loading = true;
    tips = await getTips(userId);
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
    const tip = tips[index];
    asignValues(tip);
    dialogInstance?.show();
}


function closeDialog() {
    dialogInstance?.hide();
}

function openConfirmForDelete(index) {
    const tip = tips[index];
    currentTip = tip;
    openConfirm = true;
}

function closeConfirm() {
    openConfirm = false;
}

function asignFile(ev) {
    file = ev.target.files[0];
}

function resetValues() {
    currentTip = null;
    description = "";
}

function asignValues(tip) {
    currentTip = tip;
    description = tip.description;
}

async function createOrUpdate() {
    submiting = true
    successMessage = null;
    errorMessage = null;

    try {
        if(currentTip) {

            const id = currentTip.$id;
            await updateTip({ id, description });
            successMessage = "Tip update success";
        } else {
            await createTip({ userId, description });
            successMessage = "Tip create success";
        }
        resetValues();
        loadTips();
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
        await deleteTip(currentTip.$id);
        currentTip = null;
        openConfirm = false;
        await loadTips();
        successMessage = "Tip delete success";
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
                            label: "Description",
                            key: "description"
                        },
                        {
                            label: "Actions",
                            key: "index",
                            renderComponent: () => CellActions
                        }
                    ]}
                />
            {:else}
                <p class="empty-state">💡 <i>No tips yet</i></p>
            {/if}
        {/if}
    </div>
</div>

<Dialog title="Add Pet" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={createOrUpdate}>
        <div class="separator-field">
            <Input type="textarea" bind:value={description} label="Description" placeholder="Text" required />
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
    
    
    
    