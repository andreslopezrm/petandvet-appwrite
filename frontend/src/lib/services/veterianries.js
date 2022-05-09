import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = "usermeta";

export async function getAllVeterianriesByCountry(country) {
    const response = await fetch(`http://localhost:4000/veterinaries?country=${country}`);
    return response.json();
}

export async function getGetVeterinary(veterinaryId){
    const response = await fetch(`http://localhost:4000/veterinary/${veterinaryId}`);
    return response.json();
}

export function buildMapUrl(latitude, longitude) {
    return `https://www.google.com.mx/maps/@${latitude},${longitude},19z`;
}