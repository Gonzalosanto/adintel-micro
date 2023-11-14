import { CompressionTypes } from "kafkajs";
import { kafka } from "./config.js";

const producer = kafka.producer();

export class ProducerFactory {
    producer;
    static instance;
    _isConnected = false;
    constructor() {
        this.producer = producer;
    }

    static getInstance(){
        if(!ProducerFactory.instance){
            ProducerFactory.instance = new ProducerFactory()
        }
        return ProducerFactory.instance;
    }

    isConnected(){
        return this._isConnected;
    }

    async start() {
        try {
            await this.producer.connect()
            this._isConnected = true;
        } catch (error) {
            console.log(error)
        }
    }

    async shutdown(){
        await this.producer.disconnect()
        this._isConnected = false;
    }

    async sendMessages(topic, messages){
        await this.producer.send({ topic: topic, messages: messages || [{ value: 'undefined message' }], compression: CompressionTypes.GZIP })
    }
}