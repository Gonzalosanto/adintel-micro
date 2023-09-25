import express from 'express';
const app = express();
import 'dotenv/config'
import { router } from "./src/routes/index.js"
import {db_client} from './src/db/mariadb.js'
import { } from './src/models/relational/index.js'

app.use(router)

db_client.sync({alter:true}) //Connects with mariadb server and sync imported models

app.listen(process.env.PORT, ()=>{
    console.log("Server is listening on : " + process.env.PORT)
})