import { wrap } from "svelte-spa-router/wrap";
import { get } from "svelte/store";
import Home from "./pages/Home.svelte";
import Events from "./pages/Events.svelte";
import Login from "./pages/Login.svelte";
import Register from "./pages/Register.svelte";
import Profile from "./pages/Profile.svelte";
import { state } from "./store";


export const routes = {
    "/": Home,
    "/events": Events,
    "/login": wrap({
        component: Login,
        conditions: [() => get(state)?.account === null]
    }),
    "/register": wrap({
        component: Register,
        conditions: [() => get(state)?.account === null]
    }),
    "/profile": wrap({
        component: Profile,
        conditions: [() => get(state)?.account !== null]
    }),
}

// export const routes = {
//     "/": Home,
//     "/events": Events,
//     "/login": wrap({
//         component: Login,
//         conditions: [() => get(state)?.account === null]
//     }),
//     "/register": wrap({
//         component: Register,
//         conditions: [() => get(state)?.account === null]
//     }),
//     "/profile": Profile
// }