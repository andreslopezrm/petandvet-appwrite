<script>
import { Close, Toasts, Toast } from "agnostic-svelte";

export let successMessage = null;
export let errorMessage = null;

export let onCloseSuccessMessage;
export let onCloseErrorMessage;

$: {
    if(successMessage) {
        setTimeout(onCloseSuccessMessage, 2000);
    }

    if(errorMessage) {
        setTimeout(onCloseErrorMessage, 2000);
    }
}
</script>

<Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
    <Toast isOpen={successMessage} type="success">
        <div class="toast-content">
            <p>{successMessage}</p>
            <Close color="var(--agnostic-primary-dark)" on:click={onCloseSuccessMessage} />
        </div>
    </Toast>
    <Toast isOpen={errorMessage} type="error">
        <p>{errorMessage}</p>
        <Close color="var(--agnostic-primary-dark)" on:click={onCloseErrorMessage} />
    </Toast>
</Toasts>
