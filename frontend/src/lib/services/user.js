import { sdk } from "../../appwrite";
import { state } from "../store";
import { getSessionId, saveSessionId } from "./local";

const COLLECTION_ID = "usermeta";

export async function createUser({ fullname, email, password, country, kind }) {
    const account = await sdk.account.create('unique()', email, password, fullname);
    const session = await sdk.account.createSession(email, password);
    saveSessionId(session.$id);
    const usermeta = await sdk.database.createDocument(COLLECTION_ID, account.$id, {
        country,
        kind
    });
    const user = {...usermeta, ...account};
    state.update(user);
}

export async function login({ email, password }) {
    const session = await sdk.account.createSession(email, password);
    saveSessionId(session.$id);

    const account = await sdk.account.get();
    const usermeta = await sdk.database.getDocument(COLLECTION_ID, account.$id);
    const user = {...usermeta, ...account};
    state.update(user);
}


export async function logout() {
    const sessionId = getSessionId();
    await sdk.account.deleteSession(sessionId);
    state.destroy();
}


export async function loadUser() {
    try {
        const account = await sdk.account.get();
        const usermeta = await sdk.database.getDocument(COLLECTION_ID, account.$id);
        const user = {...usermeta, ...account, metaId: usermeta.$id};
        state.init(user)
    } catch(err) {
        state.init(null);
    }
}

export async function isLogged() {
    try {
        const user = await sdk.account.get();
        return user;
    } catch {
        return null;
    }
}