import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'events';

export function createEvent({ userId, title, description, imageId, imageUrl, address, country, datetime }) {
    return sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, title, description, imageId, imageUrl, address, country, datetime });
}

export async function getEvents(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export function updateEvent({ id, title, description, imageId, imageUrl, address, country, datetime }) {
    return sdk.database.updateDocument(COLLECTION_ID, id, { title, description, imageId, imageUrl, address, country, datetime });
}

export function deleteEvent(id) {
    return sdk.database.deleteDocument(COLLECTION_ID, id);
}

export async function getEventsByCountry(country, offset = 0, limit = 25) {
    console.log(country);
    try {
        const response = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('country', country) ], limit, offset);
        return response?.documents ?? [];
    } catch(err) {
        return [];
    }
}

export function getEvent(id) {
    return sdk.database.getDocument(COLLECTION_ID, id);
}