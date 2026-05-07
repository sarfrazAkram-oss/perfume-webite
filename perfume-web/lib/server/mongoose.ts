import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cache;
}

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGODB_URI in the Vercel environment.");
  }

  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
