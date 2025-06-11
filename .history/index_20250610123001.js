const expreess = require('express');
require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


MongoClient.connect(uri, function (err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
