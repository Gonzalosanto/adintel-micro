import { kafka } from "./config.js";

const consumer = kafka.consumer({groupId: 'requestor-consumer'});

export const consumeTopic = async (topic) => {
    await consumer.connect();
    await consumer.subscribe(topic)
    await consumer.run({
        eachMessage: async ({ topic, message, partition}) => {
            console.log(message)
        }
    })
}