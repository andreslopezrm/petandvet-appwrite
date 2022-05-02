<script>
import {Button, Dialog, Loader} from "agnostic-svelte";

export let open = false;
export let message = "";
export let onAccept;
export let onClose;
export let submiting;

let dialogInstance;

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

$: if(open) {
    dialogInstance?.show();
} else {
    dialogInstance?.hide();
}

function handleOnAccept() {
    if(onAccept) {
        onAccept();
    }
}

function handleOnClose() {
    if(onClose) {
        onClose();
    }
}

</script>

<Dialog closeButtonPosition="center" title="Confirm" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
   {message}
   <div class="confirm-action">
    <Button type="button" mode="primary" on:click={handleOnAccept} isDisabled={submiting} size="large">
        <span>Acept </span> 
        {#if submiting}
            <Loader />
        {/if}
    </Button>
    <Button type="button" isLink on:click={handleOnClose} isDisabled={submiting} size="large">Cancel</Button>
   </div>
</Dialog>

<style>
    .confirm-action {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
        gap: 1rem;
    }
</style>