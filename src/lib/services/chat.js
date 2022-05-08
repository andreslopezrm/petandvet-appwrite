import { sdk, Query } from "../../appwrite";

const COLLECTION_ROOM_ID = 'rooms';
const COLLECTION_CHAT_ID = 'chats';

export function createRoom(veterinaryId, ownerId) {
    return sdk.database.createDocument(COLLECTION_ROOM_ID, 'unique()', { veterinaryId, ownerId, createAt: +new Date() });
}

export async function findRoom(veterinaryId, ownerId) {
    const rooms = await sdk.database.listDocuments(COLLECTION_ROOM_ID, [ Query.equal('veterinaryId', veterinaryId), Query.equal('ownerId', ownerId) ]);
    return rooms.documents[0];
}


export async function getAllChats(userId, kind) {
    console.log(userId, kind)
    const condition = kind === 'veterinary' ? Query.equal('veterinaryId', userId) : Query.equal('ownerId', userId);
    const rooms = await sdk.database.listDocuments(COLLECTION_ROOM_ID, [ condition ]);

    const roowsWithUsers = rooms.documents.map(async (room) => {
        room.veterinary = await getUser(room.veterinaryId);
        room.owner = await getUser(room.ownerId);
        room.messages = await getMessages(room.$id);
        return room;
    });

    const chats = await Promise.all(roowsWithUsers);
    return chats;
}

export async function getMessages(roomId) {
    const messsages = await sdk.database.listDocuments(COLLECTION_CHAT_ID, [ Query.equal('roomId', roomId) ]);
    return messsages.documents
}

export async function getUser(userId) {
    const response = await fetch(`http://localhost:4000/user/${userId}`);
    return response.json();
}