import { Appwrite, Query } from 'appwrite';

const server = {
    endpoint: 'https://8080-appwrite-integrationforg-l4agqveejyf.ws-us44.gitpod.io/v1',
    project: 'hackaton-appwrite',
}

const sdk = new Appwrite();

sdk.setEndpoint(server.endpoint).setProject(server.project);

export { sdk, server, Query };