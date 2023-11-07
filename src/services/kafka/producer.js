import { CompressionTypes } from "kafkajs";
import { kafka } from "./config.js";

const producer = kafka.producer();

export const handleReportsProduced = async (topic, messages) => {
    await producer.connect();
    await producer.send({topic: topic, messages: messages || [{value: 'undefined message'}], compression: CompressionTypes.GZIP})
}