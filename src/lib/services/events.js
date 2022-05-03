import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'events';

export async function createEvent({ userId, title, description, imageId, imageUrl, address, country, datetime }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, title, description, imageId, imageUrl, address, country, datetime });
}

export async function getEvents(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export async function updateEvent({ id, title, description, imageId, imageUrl, address, country, datetime }) {
    return await sdk.database.updateDocument(COLLECTION_ID, id, { title, description, imageId, imageUrl, address, country, datetime });
}

export async function deleteEvent(id) {
    return await sdk.database.deleteDocument(COLLECTION_ID, id);
}