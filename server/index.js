const express = require('express');
const app = express();
const cors = require('cors');
const sdk = require('node-appwrite');
require('dotenv').config()

console.log(process.env.APPWRITE_ENDPOINT)

const { Query  } = sdk;

const client = new sdk.Client();
const database = new sdk.Database(client);
const users = new sdk.Users(client);

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY)
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


app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening to requests`);
});