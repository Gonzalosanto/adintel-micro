import { kafka } from "./config.js";

const consumer = kafka.consumer({groupId: 'requestor-consumer'});

export const consumeTopic = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({topic:topic, fromBeginning: true})
    await consumer.run({
        eachBatch: async ({batch}) => {
            for (const message of batch.messages) {
                const msg = parseMessageFromQueue(message.key.toString(), message.value.toString())
                //TODO: for every message make a chainRequest... then, return reports...
            }
        }
    })
}

const parseMessageFromQueue = (key, value) => {
    try {
        const messageObject = JSON.stringify({[key]: value})
        return JSON.parse(messageObject)
    } catch (error) {
        console.log(`Error parsing queue message... Check if message format is valid!\n${error}`)
    }
}