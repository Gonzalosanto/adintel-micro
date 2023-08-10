import { connect } from '../DAOs/mongodb/MongoClient.js'
const coll = 'files'
const MONGO_OPTIONS = {}
const connectTo = async (collection,db) => {
    const clientInstance = await connect()
    const connection = await clientInstance.db(db)
    return connection.collection(collection)
}

const collection = await connectTo(coll,process.env.MONGO_DB_NAME)

export const Insert = async (data) => {
    return collection.insertOne(data)
}

export const InsertMany = async (data) => {
    return collection.insertMany(data)
}

export const Get = async () => {
    return collection.find()
}

export const Update = async (id, data) => {
    return collection.updateOne(id, data)
}

export const Delete = async (id) => {
    return collection.deleteOne(id)
}