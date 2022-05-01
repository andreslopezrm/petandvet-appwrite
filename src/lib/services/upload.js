import { sdk } from "../../appwrite";

const BUCKET_ID = "625b7fa68a316d9abb36";

async function getPetPhotoUrl(imageId) {
    const photo = await sdk.storage.getFilePreview(BUCKET_ID, imageId)
    return photo?.href;
 }
 
export async function uploadPetPhoto(image) {
    if(!image) {
        return null;
    }

    const bucketFile = await sdk.storage.createFile(BUCKET_ID, 'unique()', image);
    if(!bucketFile) {
        return null;
    }

    return await getPetPhotoUrl(bucketFile.$id);
}

