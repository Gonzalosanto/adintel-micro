import { kafka } from "./config.js";
import { getRequest } from "../../controllers/requests.controller.js"

import Queue from '../requestor/Queue.js';
import { sendReport } from "./producer.js";
const consumer = kafka.consumer({groupId: 'requestor-consumer'});

/**
 * This method consume every message that comes from Kafka topic identified by the string passed as 'topic'. Every message or batch will invoke a request or batch of requests.
 * @param {string} topic String that represents the topic name of Kafka partition. 
 */
export const consumeTopic = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({fromBeginning: true, topics:[topic]})
    await consumer.run({
        eachBatch: async ({batch, heartbeat, uncommittedOffsets}) => {
            await heartbeat()
            for (const message of batch.messages) {
                const msg = parseMessageFromQueue(message.key.toString(), message.value.toString())
               Queue.enqueue(getRequest(message.value.toString()))
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
