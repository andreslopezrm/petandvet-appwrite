<script>
import { Button, Card, Table } from "agnostic-svelte";
import { params, replace } from "svelte-spa-router";
import Aside from "../componentes/Aside.svelte";
import CellViewInMap from "../componentes/cells/CellViewInMap.svelte";
import QrButton from "../componentes/common/QrButton.svelte";
import ShareButton from "../componentes/common/ShareButton.svelte";
import VetAvatar from "../componentes/common/VetAvatar.svelte";
import LoaderDots from "../componentes/LoaderDots.svelte";
import ToastMultiple from "../componentes/ToastMultiple.svelte";
import { getFlag } from "../services/countries";
import { buildMapUrl, getGetVeterinary } from "../services/veterianries";
import { isLogged } from "../services/user";
import { findRoom, createRoom } from "../services/chat";

let loading = true;
let submiting = false;
let veterinary;
let errorMessage;

params.subscribe(load);

async function load(data) {
    if(!data?.veterinaryId || veterinary) {
        return;
    }

    try {
        const remote = await getGetVeterinary(data.veterinaryId);
        remote.rows = remote.addresses.map(({ description, phone, latitude, longitude }) => ({ description, phone, map: buildMapUrl(latitude, longitude) }));
        veterinary = remote;

    } catch(err) {
        errorMessage = false;
    } finally {
        loading = false;
    }
}

async function contactToVet() {
    submiting = true;
    const user = await isLogged();
    if(!user) {
        submiting = false;
        replace("/login");
        return;
    }

    const veterinaryId = veterinary.$id;
    const ownerId = user.$id;

    if(veterinaryId === ownerId) {
        errorMessage = 'Same user can not contact';
        return;
    }

    try {
        let room;
        room = await findRoom(veterinaryId, ownerId);
        if(!room) {
            room = await createRoom(veterinaryId, ownerId);
        }
        loading = false;
        replace(`/chats?first=${room.$id}`);
    } catch(err) {
        loading = false;
        errorMessage = err.message;
    }
}
</script>


<main class="container mt-1">
    <section>
        <h2 class="big-title">Veterinary</h2>
        <div class="mt-1">
            {#if loading}
                <LoaderDots />
            {:else}
                <div class="veterinary-container">
                    <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
                        <div class="veterinary-details">
                            <div class="veterinary-avatar">
                                <VetAvatar veterinary={veterinary} />
                            </div>
                            <p>
                                <strong>Name:</strong> {veterinary.name}
                            </p>
                            <p>
                                <strong>Email:</strong> <a href={`mailto:${veterinary.email}`}>{veterinary.email}</a>
                            </p>
                            <p>
                                <strong>Country: </strong>
                                {#await getFlag(veterinary.country)}
                                    <span>{veterinary.country}</span>
                                {:then resource} 
                                    <img width="20" src={resource.href} alt={veterinary.name} />
                                {/await}
                            </p>
                            <div class="veterinary-addresses">
                                <strong>Addresses</strong>
                                <Table
                                    rows={veterinary.rows}
                                    headers={[
                                        {
                                            label: "Description",
                                            key: "description",
                                        },
                                        {
                                            label: "Phone",
                                            key: "phone"
                                        },
                                        {
                                            label: "Action",
                                            key: "map",
                                            renderComponent: () => CellViewInMap
                                        }
                                    ]}
                                />
                            </div>
                            <div class="veterinary-item-actions">
                                <div class="veterinary-contact">
                                    <Button on:click={contactToVet} isDisabled={submiting} mode="primary">
                                        {#if submiting}
                                            Sending...
                                        {:else}
                                            Contact
                                        {/if}
                                    </Button>
                                </div>

                                <div class="veterinary-share">
                                    <ShareButton isPrimary link={`${window.location.href}#/event/${veterinary.$id}`} />
                                    <QrButton text={`${window.location.href}#/event/${veterinary.$id}`} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            {/if}
        </div>
    </section>
    <Aside showVeterinaries={false} />
</main>

<ToastMultiple
    errorMessage={errorMessage}
    onCloseErrorMessage={_ => { errorMessage = null }}
/>

<style>
    .veterinary-details {
        padding: 1rem 2rem;
        text-align: left;
        width: 100%;
    }

    .veterinary-details p {
        margin-bottom: 0.5rem;
    }

    .veterinary-avatar {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
    }

    .veterinary-addresses {
        margin: 1rem 0;
    }

    .veterinary-item-actions {
        margin-top: 1.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .veterinary-share {
        display: flex;
        gap: 1rem;
    }
</style>
