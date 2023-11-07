import { Kafka } from "kafkajs"

export const kafka = new Kafka({
    clientId: 'requestor',
    brokers: ['172.23.134.125:9092']
})