import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'pets';

export async function createPet({ userId, name, race, age, description, image }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, name, race, age, description, image });
}

export async function getPets(userId, offset = 0, limit = 25) {
    return await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
}

export function updatePet() {

}