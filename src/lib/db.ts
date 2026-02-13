import mongoose from "mongoose";

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
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env.local");
  }

  const readyState = mongoose.connection.readyState;
  if (cached.conn && readyState === 1) return cached.conn;
  if (cached.promise && readyState === 2) {
    cached.conn = await cached.promise;
    globalWithMongoose.mongooseCache = cached;
    return cached.conn;
  }
  if (readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        dbName: "restaurantDB",
        bufferCommands: false,
        serverSelectionTimeoutMS: 20000,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  await (mongoose.connection.asPromise?.() ?? Promise.resolve());
  globalWithMongoose.mongooseCache = cached;
  return cached.conn;
}
