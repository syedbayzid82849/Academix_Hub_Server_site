const expreess = require('express');
require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
