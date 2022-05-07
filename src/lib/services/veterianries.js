import { sdk, Query } from "../../appwrite";

const COLLECTION_ID = "usermeta";

export async function getAllVeterianriesByCountry(country, offset = 0, limit = 25) {
    const response = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('kind', 'veterinary') ], limit, offset);
    console.log(response.documents);
    //6270619e613fbab1497a
}