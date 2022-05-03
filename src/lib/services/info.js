import { sdk } from "../../appwrite";

export async function getAvatarUrl(account) {
    const imageUrl = account?.imageUrl;
    if(imageUrl) {
        return imageUrl;
    }

    const avatar = await sdk.avatars.getInitials(account?.name ??  "");
    return avatar?.href;
}

export async function updateAvatarUrl(account, file) {
    
}