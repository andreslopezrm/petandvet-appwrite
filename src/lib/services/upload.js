import { sdk } from "../../appwrite";

const BUCKET_PETS_ID = "625b7fa68a316d9abb36";
const BUCKET_EVENTS_ID = "62706956eaa2e164a378";

async function uploadPhoto(buckedId, image) {
    const photo = { imageId: null, imageUrl: null };
    if(!image) {
        return photo;
    }

    const bucketFile = await sdk.storage.createFile(buckedId, 'unique()', image);
    if(!bucketFile) {
        return photo;
    }

    const url = await getPetPhotoUrl(buckedId, bucketFile.$id);
    photo.imageId = bucketFile.$id;
    photo.imageUrl = url;

    return photo;
}

async function getPetPhotoUrl(buckedId, imageId) {
    const photo = await sdk.storage.getFilePreview(buckedId, imageId)
    return photo?.href;
}
 
export async function uploadPetPhoto(image) {
    return await uploadPhoto(BUCKET_PETS_ID, image);
}

export async function deletePetPhoto(imageId) {
    await sdk.storage.deleteFile(BUCKET_PETS_ID, imageId);
}


export async function uploadEventPhoto(image) {
    return await uploadPhoto(BUCKET_EVENTS_ID, image);
}

export async function deleteEventPhoto(imageId) {
    await sdk.storage.deleteFile(BUCKET_EVENTS_ID, imageId);
}