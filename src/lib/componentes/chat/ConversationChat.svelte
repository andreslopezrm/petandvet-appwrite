<script>
import { Card } from "agnostic-svelte";
export let chat;
export let userId;

let messages = [...chat?.messages ?? []];
</script>

<Card>
    <div class="conversation-chat">
        {#if messages.length === 0}
            <p>
                <i>No messages yet</i>
            </p>
        {:else}
            <div>
                <p class="conversation-title">Conversation</p>
                <div class="conversation-list">
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
            </div>
        {/if}
    </div>
</Card>

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