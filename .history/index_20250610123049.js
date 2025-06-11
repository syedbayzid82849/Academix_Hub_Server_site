const expreess = require('express');
require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
