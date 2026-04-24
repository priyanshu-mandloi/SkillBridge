import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is missing from .env");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db("skillbridge");
}

// Typed collection helpers
export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function getProjectsCollection() {
  const db = await getDb();
  return db.collection("projects");
}
