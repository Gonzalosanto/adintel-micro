import { CompressionTypes } from "kafkajs";
import { kafka } from "./config.js";

const producer = kafka.producer({allowAutoTopicCreation: true});

export const sendReport = async (message) => {
    await producer.connect();
    await producer.send({topic: process.env.REPORTS_TOPIC, messages: message, compression: CompressionTypes.GZIP});
}