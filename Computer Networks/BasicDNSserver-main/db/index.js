import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB=async ()=>
{
    try
    {
        const connectionString=`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`;
        const db=await mongoose.connect(connectionString);
        console.log("MongoDB connected! ",db.connection.host);
        return db.connection;
    }
    catch(error)
    {
        console.log("MongoDB connection failed! ",error);
        process.exit(1);
    }
}

export default connectDB;