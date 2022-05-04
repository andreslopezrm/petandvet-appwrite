import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'address';

export async function createAddress({ userId, description, country, latitude, longitude, phone }) {
    return sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, description, country, latitude, longitude, phone });
}

export async function getAddress(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export async function updateAddress({ id, description, country, latitude, longitude, phone }) {
    return sdk.database.updateDocument(COLLECTION_ID, id, { description, country, latitude, longitude, phone });
}

export async function deleteAddress(id) {
    return sdk.database.deleteDocument(COLLECTION_ID, id);
}