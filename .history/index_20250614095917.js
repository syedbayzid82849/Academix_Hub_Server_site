const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const enrolledUsersDetails = database.collection('enrolledUsersDetails')
        const studentSaysCollection = database.collection("studentSays");
        // const instructorsCollection = database.collection("instructors");   
        // const usersCollection = database.collection("users");

        // post operations
        // app.post('/enrollments', async (req, res) => {
        //     const { userEmail, courseId } = req.body;

        //     const already = await enrollmentsCollection.findOne({ userEmail, courseId });
        //     if (already) return res.send({ success: false, message: 'Already enrolled' });

        //     const course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
        //     const enrolledCount = await enrollmentsCollection.countDocuments({ courseId });

        //     if (enrolledCount >= course.seats) {
        //         return res.send({ success: false, message: 'No seats left' });
        //     }

        //     const result = await enrollmentsCollection.insertOne(req.body);
        //     res.send({ success: true, insertedId: result.insertedId });
        // });


        // get operations

        // all courses find 
        app.get('/all-course', async (req, res) => {
            const courses = await coursesCollection.find().toArray();
            res.send(courses);
        });

        // find course for details
        app.get('/all-course/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await coursesCollection.findOne(query);
            res.send(result);
        })

        // find all enrolled users
        app.get('/enrollled-users', async (req, res) => {
            const enrolledUsers = await enrolledUsersDetails.find().toArray();
            res.send(enrolledUsers);
        });

        // find to user enroll or not enroll 
        app.get('/enrollled-users/:id', async (req, res) => {
            const id = req.params.id
            const query = {courseId:id};
            const result = await enrolledUsersDetails.findOne(query);
            res.send(result);
        });

        // find user added course 
        app.get('/menage-course/:email', async(req, res) => {
            const email = req.params.email;
            const filter
        })

        // students says
        app.get('/student-says', async (req, res) => {
            const studentSays = await studentSaysCollection.find().toArray();
            res.send(studentSays);
        });

        // post operations

        // send course data to database 
        app.post('/all-course', async (req, res) => {
            const course = req.body;
            const result = await coursesCollection.insertOne(course);
            res.send(result);
        });

        // send to enrolled user data to databse 
        app.post('/enrollled-users', async (req, res) => {
            const enrolledData = req.body;
            const result = await enrolledUsersDetails.insertOne(enrolledData)
            res.send(result);
        })

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
