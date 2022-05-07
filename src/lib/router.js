import { wrap } from "svelte-spa-router/wrap";
import { get } from "svelte/store";
import Home from "./pages/Home.svelte";
import Events from "./pages/Events.svelte";
import Login from "./pages/Login.svelte";
import Register from "./pages/Register.svelte";
import Profile from "./pages/Profile.svelte";
import Pet from "./pages/Pet.svelte";
import Tips from "./pages/Tips.svelte";
import Event from "./pages/Event.svelte";
import Veterinaries from "./pages/Veterinaries.svelte";
import { state } from "./store";


export const routes = {
    "/": Home,
    "/events": Events,
    "/event/:eventId": Event,
    "/veterinaries": Veterinaries,
    "/pet/:petId": Pet,
    "/tips": Tips,
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