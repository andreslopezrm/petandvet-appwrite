import { sdk } from "../../appwrite";
import { deleteAvatarPhoto, uploadAvatarPhoto } from "./upload";

const COLLECTION_META_ID = "usermeta";

export async function getAvatarUrl(account) {
    const imageUrl = account?.imageUrl;
    if(imageUrl) {
        return imageUrl;
    }

    const avatar = await sdk.avatars.getInitials(account?.name ??  "");
    return avatar?.href;
}

export async function updateAvatarUrl(account, file) {
    if(!file) {
        return;
    }

    if(account?.imageId) {
        await deleteAvatarPhoto(account?.imageId);
    }

    const { imageId, imageUrl } = await uploadAvatarPhoto(file);
    await sdk.database.updateDocument(COLLECTION_META_ID, account.$id, { imageId, imageUrl })
}

export function updateInfoName(name) {
    return sdk.account.updateName(name);
}

export function updateInfoEmailPassword(email, password) {
    return sdk.account.updateEmail(email, password)
}

export function updateInfoGeneral({ metaId, country, kind }) {
    return sdk.database.updateDocument(COLLECTION_META_ID, metaId, { country, kind})
}

export function updateInfoPassword(password, oldPassword) {
    return sdk.account.updatePassword(password, oldPassword);
}