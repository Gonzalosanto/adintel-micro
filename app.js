import express from 'express';
const app = express();
import 'dotenv/config'
import { router } from "./src/routes/index.js"
import { consumeTopic } from './src/services/kafka/consumer.js';
import { error } from './src/middlewares/logger/index.js';
import { ProducerFactory } from './src/services/kafka/producer.js';

app.use(router)

app.listen(process.env.PORT, async ()=>{
    const topic = 'reports-topic'
    try {
        const instance = ProducerFactory.getInstance();
        if(!instance._isConnected){instance.start()}
        await consumeTopic(topic)
    } catch (e) {
        error(`Error consuming: ${topic}, ${e}`)
    }
    console.log("Server is listening on : " + process.env.PORT)
})