import { sdk } from "../../appwrite";

const BUCKET_ID = "625b7fa68a316d9abb36";

async function getPetPhotoUrl(imageId) {
    const photo = await sdk.storage.getFilePreview(BUCKET_ID, imageId)
    return photo?.href;
 }
 
export async function uploadPetPhoto(image) {
    const photo = { imageId: null, imageUrl: null };
    if(!image) {
        return photo;
    }

    const bucketFile = await sdk.storage.createFile(BUCKET_ID, 'unique()', image);
    if(!bucketFile) {
        return photo;
    }

    const url = await getPetPhotoUrl(bucketFile.$id);
    photo.imageId = bucketFile.$id;
    photo.imageUrl = url;

    return photo;
}

export async function deletePhoto(imageId) {
    await sdk.storage.deleteFile(BUCKET_ID, imageId);
}