import { sdk, Query } from "../../appwrite";

const COLLECTION_ROOM_ID = 'rooms';
const COLLECTION_CHAT_ID = 'chats';

export function createRoom(veterinaryId, ownerId) {
    return sdk.database.createDocument(COLLECTION_ROOM_ID, 'unique()', { veterinaryId, ownerId });
}

export async function findRoom(veterinaryId, ownerId) {
    const rooms = await sdk.database.listDocuments(COLLECTION_ROOM_ID, [ Query.equal('veterinaryId', veterinaryId), Query.equal('ownerId', ownerId) ]);
    return rooms.documents[0];
}