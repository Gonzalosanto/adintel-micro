import { MongoClient } from "mongodb";
import { error } from "../../middlewares/logger/index.js";
const MONGO_OPTIONS = {}
let conn
const pool = new MongoClient(process.env.MONGO_URL,{ ...MONGO_OPTIONS, useNewUrlParser: true, useUnifiedTopology: true});

export const connect = async () => {
  if(conn){return conn}
  try {
    conn = await pool.connect()
    return conn;
  } catch (err) {
    error(`Failed to connect to MongoDB: ${err}`);
    return { message: `Failed to connect to MongoDB: ${err}` }
  }
}

export const disconnect = async () => {
  return pool.close();
}