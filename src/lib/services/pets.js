import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'pets';

export async function createPet({ userId, name, race, description, imageId, imageUrl, isPublic = false }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, name, race, description, imageId, imageUrl, isPublic });
}

export async function getPets(userId, offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
        return reponse?.documents ?? [];
    } catch {
        return [];
    }
}

export async function updatePet({ id, name, race, description, imageId, imageUrl, isPublic }) {
    return await sdk.database.updateDocument(COLLECTION_ID, id, { name, race, description, imageId, imageUrl, isPublic });
}

export async function deletePet(id) {
    return await sdk.database.deleteDocument(COLLECTION_ID, id);
}


export async function getPublicPets(offset = 0, limit = 25) {
    try {
        const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('isPublic', true) ], limit, offset);
        return reponse?.documents ?? [];
    } catch(err) {
        console.log(err)
        return [];
    }
}