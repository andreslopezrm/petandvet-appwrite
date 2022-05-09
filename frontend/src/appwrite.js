import { Appwrite, Query } from 'appwrite';


const server = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    project: process.env.APPWRITE_PROJECT,
}

const sdk = new Appwrite();

sdk.setEndpoint(server.endpoint).setProject(server.project);

export { sdk, server, Query };