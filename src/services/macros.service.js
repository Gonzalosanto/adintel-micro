import { connect } from '../DAOs/mongodb/MongoClient.js'
const db = process.env.MONGO_DB_NAME
const coll = 'macros'
const connectTo = async (collection, db) => {
    const client = await connect();    
    const connection = client.db(db);
    return connection.collection(collection)
}

const collection = await connectTo(coll, db)

export const InsertMacro = async (data) => {
    return collection.insertOne(data)
}

export const InsertManyMacros = async (data) => {
    return collection.insertMany(data)
}

export const GetMacros = async (skip, limit) => {
    return collection.find().skip(skip).limit(limit).toArray()
}

export const GetMacrosLength = async () => {
    return collection.countDocuments()
}

export const UpdateMacro = async (id, data) => {
    return collection.updateOne(id, data)
}

export const DeleteMacro = async (id) => {
    return collection.deleteOne(id)
}