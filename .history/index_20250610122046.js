const expreess = require('express');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = expreess();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


var uri = "mongodb://<db_username>:<db_password>@ac-5st292p-shard-00-00.ev6secp.mongodb.net:27017,ac-5st292p-shard-00-01.ev6secp.mongodb.net:27017,ac-5st292p-shard-00-02.ev6secp.mongodb.net:27017/?ssl=true&replicaSet=atlas-pz0xnc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
MongoClient.connect(uri, function (err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
