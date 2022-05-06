import { sdk } from "../../appwrite";

export function getQr(text = '') {
    return sdk.avatars.getQR(text);
}