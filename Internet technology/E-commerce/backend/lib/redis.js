import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.UPSTASH_URL;
//console.log(url);
export const redis = new Redis(url);
//await client.set("ghh", "bar");
//47.43