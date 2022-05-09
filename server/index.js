const express = require('express');
const app = express();
const cors = require('cors');
const sdk = require('node-appwrite');

const { Query  } = sdk;

const client = new sdk.Client();
const health = new sdk.Health(client);
const database = new sdk.Database(client);
const users = new sdk.Users(client);

client
    .setEndpoint('https://8080-appwrite-integrationforg-l4agqveejyf.ws-us44.gitpod.io/v1')
    .setProject('hackaton-appwrite')
    .setKey('2b227380754f53aad65be07299272d658ab53f4c9c7e5e9aa02f3cce30afb2c3966c8283db66806ce5dfca463f616b9a7148d82eecde0f8fa44094b72ac3779bfc1290ad5e67d38ddc0b58d71afd4a56366e607a7be578f2edb756046e16753bd585c9f4e81fcaa1dfd7d79e605967e0522e3c1407ddb99501993c3d0d4c49a7')
;

app.use(cors());

app.get('/veterinaries', async function(req, res) {
    const country = req.query?.country ?? 'US';

    const { documents } = await database.listDocuments('usermeta', [ Query.equal('kind', 'veterinary'), Query.equal('country', country)  ]);
    
    const promises = documents.map(async (doc) => {
      const user =  await users.get(doc.$id);
      const addresses = await database.listDocuments('address', [ Query.equal('userId', doc.$id) ]);
      return {...doc, ...user, addresses: addresses.documents}
    });

    const veterinaries = await Promise.all(promises)
    res.json(veterinaries);
});


app.get('/veterinary/:id', async function(req, res) {
  const id = req.params.id;
  
  const meta = await database.getDocument('usermeta', id);
  const info = await users.get(id);
  const { documents } = await database.listDocuments('address', [ Query.equal('userId', id) ]);

  const veterinary = {...meta, ...info, addresses: documents };
  res.json(veterinary);
});


app.get('/user/:id', async function(req, res) {
  const id = req.params.id;
  const info = await users.get(id);
  const meta = await database.getDocument('usermeta', id);

  const user = {...meta, ...info};
  res.json(user);
});


app.listen(4000, () => {
  console.log(`Listening to requests on http://localhost:4000`);
});