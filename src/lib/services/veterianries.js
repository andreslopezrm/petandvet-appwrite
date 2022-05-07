import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = "usermeta";

export async function getAllVeterianriesByCountry(country) {
    const response = await fetch(`http://localhost:4000/veterinaries?country=${country}`);
    return response.json();
}