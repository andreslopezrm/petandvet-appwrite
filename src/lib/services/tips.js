import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'tips';

export async function createTip({ userId, description }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, description });
}

export async function getTips(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export async function updateTip({ id, description }) {
    return await sdk.database.updateDocument(COLLECTION_ID, id, { description });
}

export async function deleteTip(id) {
    return await sdk.database.deleteDocument(COLLECTION_ID, id);
}