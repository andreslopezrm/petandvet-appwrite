<script>
import { onMount } from "svelte";


import { get } from "svelte/store";
import { state } from "../store";
import { getAllChats, getMessages } from "../services/chat";
import LoaderDots from "../componentes/LoaderDots.svelte";
import ToastMultiple from "../componentes/ToastMultiple.svelte";
import AsideChat from "../componentes/chat/AsideChat.svelte";
import ConversationChat from "../componentes/chat/ConversationChat.svelte";

let userId = get(state)?.account?.$id;
let kind = get(state)?.account?.kind;
let loading = true;
let errorMessage;

let chats = [];
let asideUsers = [];
let currentChat;
let loadingChats = false;

onMount(async () => {
    try {
        chats = await getAllChats(userId, kind);
        asideUsers = chats.map(({ veterinary, owner }) =>  veterinary.$id === userId ? owner : veterinary);
        currentChat = chats[0];
    } catch(err) {
        errorMessage = err.message;
    } finally {
        loading = false;
    }
});

async function handleSelect({ detail }) {
    loadingChats = true;
    const { index } = detail;
    const roomId = chats[index].$id;
    const messages = await getMessages(roomId);
    currentChat = {...chats[index], messages }
    loadingChats = false;
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
                <div class="chat-user">
                    <AsideChat on:select={handleSelect} users={asideUsers} />
                </div>
                <div class="chat-conversation">
                    {#if loadingChats}
                        <LoaderDots />
                    {:else}
                        <ConversationChat chat={currentChat} userId={userId} />
                    {/if}
                </div>
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
        display: flex;
        gap: 1rem;
    }

    .chat-user {
        flex: 1;
    }

    .chat-conversation  {
        flex: 2;
    }
</style>