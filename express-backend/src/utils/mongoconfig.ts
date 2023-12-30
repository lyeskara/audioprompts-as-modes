import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

let db = null;

async function connectDB(): Promise<typeof mongoose> {
    if (!db) {
        try {
            const connection = await mongoose.connect(`mongodb://${process.env.DB_HOST}:27017`);
            db = connection;
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        }
    }
    return db;
};

export default connectDB;
