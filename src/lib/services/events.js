import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = 'events';

export async function createEvent({ userId, title, description, imageId, imageUrl, address, country, datetime }) {
    return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, title, description, imageId, imageUrl, address, country, datetime });
}