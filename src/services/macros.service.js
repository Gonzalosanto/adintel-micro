import { MongoDBConnection } from '../DAOs/mongodb/MongoClient.js'
const coll = 'macros'
const MONGO_OPTIONS = {}
const connectTo = async (collection) => {
    const clientInstance = new MongoDBConnection(process.env.MONGO_DB, MONGO_OPTIONS ||  process.env.MONGO_OPTIONS)
    const connection = await clientInstance.connect(process.env.MONGO_DB_NAME)
    return connection.collection(collection)
}

const collection = connectTo(coll)

export const InsertMacro = async (data) => {
    return (await collection).insertOne(data)
}

export const InsertManyMacros = async (data) => {
    return (await collection).insertMany(data)
}

export const GetMacros = async (skip, limit) => {
    return (await collection).find().skip(skip).limit(limit).toArray()
}

export const GetMacrosLength = async () => {
    return (await collection).countDocuments()
}

export const UpdateMacro = async (id, data) => {
    return (await collection).updateOne(id, data)
}

export const DeleteMacro = async (id) => {
    return (await collection).deleteOne(id)
}