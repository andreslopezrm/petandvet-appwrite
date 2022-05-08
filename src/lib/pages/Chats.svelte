<script>
import { onMount } from "svelte";


import { get } from "svelte/store";
import { state } from "../store";
import { getAllChats } from "../services/chat";
import LoaderDots from "../componentes/LoaderDots.svelte";
import ToastMultiple from "../componentes/ToastMultiple.svelte";
import AsideChat from "../componentes/chat/AsideChat.svelte";

let userId = get(state)?.account?.$id;
let kind = get(state)?.account?.$kind;
let loading = true;
let errorMessage;

let chats = [];
let asideUsers = [];

onMount(async () => {
    try {
        chats = await getAllChats(userId, kind);
        asideUsers = chats.map(({ veterinary, owner }) =>  veterinary.$id === userId ? owner : veterinary);
        console.log(asideUsers)
    } catch(err) {
        errorMessage = err.message;
    } finally {
        loading = false;
    }
});

function handleSelect(evt) {
    console.log(evt);
}

</script>

<main class="container mt-1">
    <section>
        <div class="container-header">
            <h2 class="big-title">
                Chats 
            </h2>
        </div>
        {#if loading}
            <LoaderDots />
        {:else}
            <div class="chat-container">
                <AsideChat on:select={handleSelect} />
                <div class="chat-conversation"></div>
            </div>
        {/if}
    </section>
</main>

<ToastMultiple
    errorMessage={errorMessage}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>

<style>
    .chat-container {

    }
</style>