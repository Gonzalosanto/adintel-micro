import {PORT,} from "./config/index.js";
import express from 'express';
const app = express();
import { router } from "./src/routes/index.js"
import { warning } from "./src/middlewares/logger/index.js";

process.on('uncaughtException', (e)=> warning(`Uncaught Exception: ${e}`))

app.use(router)

app.listen(PORT, ()=>{
    console.log("Server is listening . . .")
})