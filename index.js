const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        const instructorsCollection = database.collection("instructors");
        const usersCollection = database.collection("users");

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
        app.get('/courseDetails/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await coursesCollection.findOne(query);
            res.send(result);
        })

        // find all enrolled users
        // find to user enroll or not enroll 
        app.get('/enrolled-users/:id', async (req, res) => {
            const courseId = req.params.id;
            const email = req.query.email;

            if (!email) {
                const query = { courseId: courseId };
                const enrolledUsers = await enrolledUsersDetails.find(query).toArray();
                return res.send(enrolledUsers);
            }

            const query = { courseId: courseId, userEmail: email };
            const result = await enrolledUsersDetails.findOne(query);
            res.send(result);
        });


        // find user added course 
        app.get('/manage-course/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { instructorEmail: email };
            const allCourses = await coursesCollection.find(filter).toArray();
            res.send(allCourses)
        })

        // edit courses 
        app.get('/edit-course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coursesCollection.findOne(query);
            res.send(result);
        })

        // find enroll data of user's 
        app.get('/myEnrolls', async (req, res) => {
            const email = req.query.email;
            const query = {
                userEmail: email
            }
            const result = await enrolledUsersDetails.find(query).toArray()
            res.send(result)
        })

        // user how may enrolled in courses 
        app.get('/enroll-count/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { userEmail: email };
            const userEnrolls = await enrolledUsersDetails.find(filter).toArray();
            res.send(userEnrolls)
        })

        // Populer courses find and show 
        app.get('/popular-courses', async (req, res) => {
            try {
                const popularCourses = await enrolledUsersDetails.aggregate([
                    {
                        $group: {
                            _id: { $toObjectId: "$courseId" }, // Ensure courseId is converted to ObjectId
                            enrollCount: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { enrollCount: -1 }
                    },
                    {
                        $limit: 6
                    },
                    {
                        $lookup: {
                            from: 'courses',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'courseDetails'
                        }
                    },
                    {
                        $unwind: '$courseDetails'
                    },
                    {
                        $project: {
                            _id: '$courseDetails._id',
                            enrollCount: 1,
                            title: '$courseDetails.title',
                            instructorName: '$courseDetails.instructorName',
                            image: '$courseDetails.image',
                            totalSeats: '$courseDetails.totalSeats',
                            duration: '$courseDetails.duration',
                            description: '$courseDetails.description'
                        }
                    }
                ]).toArray();

                res.send(popularCourses);
            } catch (error) {
                console.error('Error fetching popular courses:', error);
                res.status(500).send({ error: 'Failed to fetch popular courses' });
            }
        });



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
        app.post('/enrolled-users', async (req, res) => {
            const enrolledData = req.body;
            const result = await enrolledUsersDetails.insertOne(enrolledData)
            res.send(result);
        })

        // patch opation 
        // update Course
        app.patch('/all-course/:id', async (req, res) => {
            const id = req.params.id
            const updatedData = req.body;

            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedData
            };

            const result = await coursesCollection.updateOne(query, updateDoc);
            res.send(result);
        })


        // delete operation 
        // user add course delete 
        app.delete('/all-course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coursesCollection.deleteOne(query)
            res.send(result)
        })

        // user enrollment delete 
        app.delete('/myEnrolls/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await enrolledUsersDetails.deleteOne(query)
            res.send(result)
        })

        // delete enrollment user stay in course details page 
        app.delete('/myEnroll/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.query.email;

            // Defensive check
            if (!email) {
                return res.status(400).send({ error: 'Email query parameter is required' });
            }

            const query = { courseId: id, userEmail: email };
            const result = await enrolledUsersDetails.deleteOne(query);

            res.send(result);
        })

        //stripe payment
        app.post("/api/create-checkout-session", async (req, res) => {
            try {
                const { plan, userEmail } = req.body;
                if (!plan || !userEmail) return res.status(400).json({ error: "Plan and email required" });

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                product_data: {
                                    name: plan.name,
                                    description: plan.subtitle,
                                },
                                unit_amount: plan.amount * 100, // cents
                            },
                            quantity: 1,
                        },
                    ],
                    customer_email: userEmail,
                    metadata: {
                        userEmail,
                        planName: plan.name
                    },
                    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
                });

                res.json({ url: session.url });
            } catch (error) {
                console.error("Stripe error:", error);
                res.status(500).json({ error: error.message });
            }
        });

        // -----------------------
        // Stripe Webhook
        // -----------------------
        app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
            const sig = req.headers["stripe-signature"];
            let event;

            try {
                event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            } catch (err) {
                console.error("Webhook signature failed:", err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const userEmail = session.metadata?.userEmail;
                const planName = session.metadata?.planName;

                if (userEmail) {
                    await usersCollection.updateOne(
                        { email: userEmail },
                        { $set: { membership: { plan: planName, updatedAt: new Date() }, isPremium: true } },
                        { upsert: true }
                    );
                    console.log(`Membership updated for ${userEmail}`);
                }
            }

            res.json({ received: true });
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
