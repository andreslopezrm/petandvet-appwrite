<script>
import { get } from "svelte/store";
import { Button, Dialog, Input, Loader } from "agnostic-svelte";
import { getAvatarUrl, updateAvatarUrl } from "../../services/info";
import { state } from "../../store";
import { loadUser } from "../../services/user";

let account;
let submiting = false;

let file;
let dialogInstance;
let imageUrl;

state.subscribe(data => {
    account = data.account;
})

$: if(account) {
    generate()
}

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

async function generate() {
    console.log(account?.imageUrl)
    if(account?.imageUrl) {
        imageUrl = account?.imageUrl;
    } else {
        imageUrl = await getAvatarUrl(account);
    }
}

async function change() {
    submiting = true;
    try {
        await updateAvatarUrl(account, file);
        await loadUser();
    } catch(err) {
        console.log(err);
    } finally {
        closeDialog();
        submiting = false
    }
}

</script>

<div class="avatar">
    {#if imageUrl}
        <div>
            <figure>
                <img width="88" src={imageUrl} alt={account?.name ?? ""} />
            </figure>
            <Button mode="primary" on:click={openDialog}>Change Avatar</Button>
        </div>
    {/if}
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
        object-fit: cover;
        width: 88px;
        height: 88px;
    }

    img:hover {
        border: 3px solid rgba(255, 255, 255, 0.3);
    }
</style>