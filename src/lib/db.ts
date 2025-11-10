import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env.local");
}

type MongooseConnection = typeof mongoose;

interface MongooseCache {
  conn: MongooseConnection | null;
  promise: Promise<MongooseConnection> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof global & { mongooseCache?: MongooseCache };
const cached: MongooseCache = globalWithMongoose.mongooseCache || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "restaurantDB",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongooseCache = cached;
  return cached.conn;
}
