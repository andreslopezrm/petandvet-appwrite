<script>
import { Card } from "agnostic-svelte";

import { createEventDispatcher } from "svelte";
import VetAvatar from "../common/VetAvatar.svelte";

const dispatch = createEventDispatcher();

export let users = [];

function handleSelect(index) {
    dispatch('select', { index });
}

</script>

<Card>
    <div class="aside-chat">
        {#each users as user, index}
            <button class="aside-chat-item" on:click={() => handleSelect(index)}>
                <VetAvatar veterinary={user} width={40} />
                <p class="aside-chat-name">{user.name}</p>
            </button>
        {/each}
    </div>
</Card> 

<style>
    .aside-chat {
        width: 100%;
    }

    .aside-chat-item {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: none;
        background: transparent;
        border-bottom: 1px solid rgba(0,0,0, 0.2);
        cursor: pointer;
        width: 100%;
    }

    .aside-chat-name {
        display: none;
    }

    @media (min-width: 600px) {
        .aside-chat-name {
            display: block;
        }
    }
</style>

