import { sdk } from "../../appwrite";
import { state } from "../store";
import { saveSessionId } from "./local";


export async function createUser({ fullname, email, password, country, kind }) {
    const account = await sdk.account.create('unique()', email, password, fullname);
    const session = await sdk.account.createSession(email, password);
    saveSessionId(session.$id);
    const usermeta = await sdk.database.createDocument('usermeta', account.$id, {
        country,
        kind
    });
    const user = {...usermeta, ...account};
    state.update(user);
}

export function login() {

}


export function logout() {

}


export async function loadUser() {
    try {
        const account = await sdk.account.get();
        const usermeta = await sdk.database.getDocument('usermeta', account.$id);
        const user = {...usermeta, ...account};
        console.log(user);
        state.init(user)
    } catch(err) {
        state.init(null);
    }
}