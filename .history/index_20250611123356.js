const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // MongoDb related
        const database = client.db("academix-hub");
        const coursesCollection = database.collection("courses");
        const studentSaysCollection = database.collection("studentSays");
        // const instructorsCollection = database.collection("instructors");   
        // const usersCollection = database.collection("users");

        // get operations

        // all courses find 
        app.get('/all-course', async (req, res) => {
            const courses = await coursesCollection.find().toArray();
            res.send(courses);
        });

        // find courses for details
        app.get('/course-details/:')

        // students says
        app.get('/student-says', async (req, res) => {
            const studentSays = await studentSaysCollection.find().toArray();
            res.send(studentSays);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
