import Home from "./pages/Home.svelte";
import Events from "./pages/Events.svelte";
import Login from "./pages/Login.svelte";
import Register from "./pages/Register.svelte";
import Profile from "./pages/Profile.svelte";

export const routes = {
    "/": Home,
    "/events": Events,
    "/login": Login,
    "/register": Register,
    "/profile": Profile
}