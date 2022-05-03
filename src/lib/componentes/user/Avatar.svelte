<script>
import { get } from "svelte/store";
import { Button, Dialog, Input, Loader } from "agnostic-svelte";
import { getAvatarUrl } from "../../services/info";
import { state } from "../../store";

let account = get(state)?.account;
let submiting = false;

let file;
let dialogInstance;

function openDialog() {
    file = null;
    dialogInstance?.show();
}

function closeDialog() {
    dialogInstance?.hide();
}

function assignDialogInstance(ev)  {
    dialogInstance = ev.detail.instance;
};

function asignFile(ev) {
    file = ev.target.files[0];
}

async function change() {
    closeDialog();
    console.log(file)
}

</script>

<div class="avatar">
    {#await getAvatarUrl(account)}
        <span />
    {:then url} 
        <div>
            <figure>
                <img width="88" src={url} alt={account?.name ?? ""} />
            </figure>
            <Button mode="primary" on:click={openDialog}>Change Avatar</Button>
        </div>
    {/await}
</div>

<Dialog title="Change Avatar" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <form on:submit|preventDefault={change}>
        <div class="separator-field">
            <Input type="file" accept="image/*" on:change={asignFile} label="Image" placeholder="Image"  />
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

<style>
    .avatar {
        display: flex;
        justify-content: center;
        margin-top: 1.2rem;
    }

    figure {
        text-align: center;
        margin-bottom: 0.8rem;
    }

    img {
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0);
    }

    img:hover {
        border: 3px solid rgba(255, 255, 255, 0.3);
    }
</style>