import express from 'express';
import routes from './api/routes.js';
import bodyParser from 'body-parser';
import connectDB from './utils/mongoconfig.js';
import dotenv from 'dotenv'
import authMiddleware from './utils/authMiddleware.js'

dotenv.config()

const app = express();

app.use(bodyParser.json())
app.use(authMiddleware)

connectDB()
    .then(() => {
        console.log("Connected to the database")
    })
    .catch((err) => {
        console.error(err)
    })


const PORT = process.env.PORT || 3000;

routes(app)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


