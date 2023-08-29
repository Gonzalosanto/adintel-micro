import express from 'express';
const app = express();
import 'dotenv/config'
import { router } from "./src/routes/index.js"
import {client} from './src/db/mariadb.js'
import { } from './src/models/relational/index.js'

app.use(router)

client.sync({force:true}) //Connects with mariadb server and sync imported models

app.listen(process.env.PORT, ()=>{
    console.log("Server is listening on : " + process.env.PORT)
})