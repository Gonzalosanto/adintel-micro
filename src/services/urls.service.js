import { MongoDBConnection } from '../DAOs/mongodb/MongoClient.js'
const coll = 'files'
const MONGO_OPTIONS = {}
const connectTo = async (collection) => {
    const clientInstance = new MongoDBConnection(process.env.MONGO_DB, MONGO_OPTIONS ||  process.env.MONGO_OPTIONS)
    const connection = await clientInstance.connect(process.env.MONGO_DB_NAME)
    return connection.collection(collection)
}

const collection = connectTo(coll)

export const Insert = async (data) => {
    return (await collection).insertOne(data)
}

export const InsertMany = async (data) => {
    return (await collection).insertMany(data)
}

export const Get = async () => {
    return (await collection).find()
}

export const Update = async (id, data) => {
    return (await collection).updateOne(id, data)
}

export const Delete = async (id) => {
    return (await collection).deleteOne(id)
}