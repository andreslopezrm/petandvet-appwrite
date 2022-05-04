<script>
    import { Button, Dialog, Input, Loader } from "agnostic-svelte";
    import { state } from "../../store";
    import { loadUser } from "../../services/user";
    import ToastMultiple from "../ToastMultiple.svelte";
    
    export let onEdit;
    export let property;
    export let type;
    export let label;
    
    let account;
    let dialogInstance;
    
    let value;
    let password;
    let submiting = false;
    
    let successMessage;
    let errorMessage;
    
    state.subscribe(data => {
        console.log(data)
        account = data.account;
        value = account?.[property];
    });
    
    function assignDialogInstance(ev)  {
        dialogInstance = ev.detail.instance;
    }
    
    function openDialogForEdit() {
        dialogInstance?.show();
    }
    
    async function handleUpdate() {
        submiting = true;
        try {
            await onEdit(value, password);
            await loadUser();
            successMessage = `${label} updated`;
        } catch(err) {
            errorMessage = err.message;
        } finally {
            submiting = false;
            password = "";
            dialogInstance?.hide();
        }
    }
    
    </script>
    
    <div class="email-edit">
        {#if account}
            <p class="email-edit-instructions">For change {label} your type your current password</p>
            <div class="email-edit-preview">
                {#if type === "password"}
                    <span>********</span>
                {:else}
                    <span>{account?.[property]}</span>
                {/if}
                <Button type="button" on:click={openDialogForEdit}>✏️</Button>
            </div>
        {/if}
    </div>
    
    <Dialog title={label} dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
        <form on:submit|preventDefault={handleUpdate}>
            <div class="separator-field">
                <Input bind:value={value} label={label} type={type} required/>
            </div>
            <div class="separator-field">
                <Input bind:value={password} type="password" label="Current Password" minlength="8" required/>
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
    
    
    <style>
        .email-edit {
            margin-top: 0.8rem;
            margin-bottom: 0.6rem;
        }
        .email-edit-preview {
            display: flex;
        }
    
        .email-edit-preview span {
            flex: 1;
        }
        .email-edit-instructions {
            font-weight: 300;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
        }
    </style>