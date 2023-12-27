import { App } from 'uWebSockets.js';
import 'dotenv/config'
import { consumeTopic } from './src/services/kafka/consumer.js';
import { error } from './src/middlewares/logger/index.js';

App().listen(process.env.PORT, async (listenSocket)=>{
    if(listenSocket) console.log("Server is listening on : " + process.env.PORT)
    const test = 'test'
    const VASTUrlTopic = 'topic'
    try {
        consumeTopic(test)
    } catch (e) {
        error(`Error consuming:${e}`)
    }
})