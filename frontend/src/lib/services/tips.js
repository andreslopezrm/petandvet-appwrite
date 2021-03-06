import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'tips';

export function createTip({ userId, description }) {
    return sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, description });
}

export async function getTips(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch(err) {
        return [];
    }
}

export function updateTip({ id, description }) {
    return sdk.database.updateDocument(COLLECTION_ID, id, { description });
}

export function deleteTip(id) {
    return sdk.database.deleteDocument(COLLECTION_ID, id);
}

export async function getAllTips() {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID);
        return reponse?.documents ?? [];
    } catch(err) {
        return [];
    }
}


