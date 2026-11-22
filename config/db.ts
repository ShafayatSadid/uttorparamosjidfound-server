import { MongoClient, Db } from 'mongodb';
import { env } from './env';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectDB(): Promise<Db> {
    if (cachedDb) return cachedDb;

    if (!cachedClient) {
        cachedClient = new MongoClient(env.MONGODB_URI);
        await cachedClient.connect();
        console.log('✅ MongoDB connected');
    }

    cachedDb = cachedClient.db(env.DB_NAME);
    return cachedDb;
}

export function getDB(): Db {
    if (!cachedDb) throw new Error('DB not connected');
    return cachedDb;
}