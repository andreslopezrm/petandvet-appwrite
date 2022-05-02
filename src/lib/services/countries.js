import { sdk } from "../../appwrite";

export async function getAllCountries() {
    let { countries } = await sdk.locale.getCountries();
    return countries.map(({ name, code }) => ({ value: code, label: name })); 
}