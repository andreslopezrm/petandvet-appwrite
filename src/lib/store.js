import { writable } from "svelte/store";

const createState = () => {

    const { subscribe, set, update } = writable({
        account: null,
    });

    return {
        subscribe,
        init: async (account = null) => {
            return set({ account });
        },
        destroy: async () => {
            update((currentState) => {
                currentState.account = null;
                return currentState;
            });
        }
    };
}

export const state = createState();