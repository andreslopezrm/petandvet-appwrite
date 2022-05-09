<script>
import { Button, Card, Input } from "agnostic-svelte";
import ToastMultiple from "../ToastMultiple.svelte";
import { sendMessageChat } from "../../services/chat";
import { sdk } from "../../../appwrite";
import { onMount } from "svelte";

export let chat;
export let userId;

let messages = [...chat?.messages ?? []];
let value;
let submiting = false;
let errorMessage;

let conversationsEl;

onMount(scrollBottom);

async function handleSend() {
    submiting = true;
    errorMessage = null;
    try {
        const message = await sendMessageChat({ roomId: chat.$id, from: userId, content: value });
        if(message) {
            value = "";
            scrollBottom();
        } else {
            errorMessage = "Can not send message";
        }
    } catch(err) {
        errorMessage = err.message;
    } finally {
        submiting = false;
    }
}

function scrollBottom() {
    if(conversationsEl) {
        conversationsEl.scrollTop = conversationsEl.scrollHeight;
    }
}

sdk.subscribe('collections.chats.documents', ({ event, payload }) => {
    if(event === "database.documents.create" && payload.roomId === chat.$id) {
        messages = [...messages, payload];
    }
});

</script>

<Card>
    <div class="conversation-chat">
        {#if messages.length === 0}
            <p>
                <i>No messages yet</i>
            </p>
            <form class="conversation-actions" on:submit|preventDefault={handleSend}>
                <Input placeholder="Type a message" bind:value={value} required/>
                <Button mode="primary" on:click={handleSend} size="medium" isDisabled={submiting}>
                    Send
                </Button>
            </form>
        {:else}
            <div>
                <p class="conversation-title">Conversation</p>
                <div class="conversation-list" bind:this={conversationsEl}>
                    {#each messages as message}
                        {#if message.from === userId}
                            <div class="conversation-me">
                                <span class="conversation-item">{message.content}</span>
                            </div>
                        {:else}
                            <div class="conversation-mesenger">
                                <span class="conversation-item">{message.content}</span>
                            </div>
                        {/if}
                    {/each}
                </div>
                <form class="conversation-actions" on:submit|preventDefault={handleSend}>
                    <Input placeholder="Type a message" bind:value={value} required/>
                    <Button mode="primary" on:click={handleSend} size="medium" isDisabled={submiting}>
                        Send
                    </Button>
                </form>
            </div>
        {/if}
    </div>
</Card>

<ToastMultiple
    errorMessage={errorMessage}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>


<style>
    .conversation-chat {
        padding: 1rem;
        width: 100%;
    }

    .conversation-item {
        color: var(--font-color-ligth);
        border-radius: 12px;
        max-width: 70%;
        padding: 0.4rem 0.8rem;
        margin-bottom: 0.4rem;
    }

    .conversation-me {
        display: flex;
        justify-content: flex-end;
    }

    .conversation-me .conversation-item {
        background-color: var(--primary-color);
    }

    .conversation-mesenger {
        display: flex;
        justify-content: flex-start;
    }

    .conversation-mesenger .conversation-item {
        background-color: var(--secundary-color);
    }

    .conversation-title {
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1e8e8;
        margin-bottom: 1rem;
    }

    .conversation-actions {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
    }

    .conversation-list {
        padding: 0.4rem;
        overflow-y: scroll;
        height: 300px;
        background-color: #e5e5f7;
        opacity: 0.8;
        background-image:  linear-gradient(135deg, #d2d2d2 25%, transparent 25%), linear-gradient(225deg, #d2d2d2 25%, transparent 25%), linear-gradient(45deg, #d2d2d2 25%, transparent 25%), linear-gradient(315deg, #d2d2d2 25%, #e5e5f7 25%);
        background-position:  10px 0, 10px 0, 0 0, 0 0;
        background-size: 20px 20px;
        background-repeat: repeat;
    }
</style>