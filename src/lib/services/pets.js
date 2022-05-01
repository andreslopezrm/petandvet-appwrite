import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'pets';

export async function createPet({ userId, name, race, age, description, imageId, imageUrl, isPublic = false }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, name, race, age, description, imageId, imageUrl, isPublic });
}

export async function getPets(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export function updatePet() {

}