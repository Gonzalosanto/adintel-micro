import express from 'express';
const app = express();
import 'dotenv'
import { router } from "./src/routes/index.js"

app.use(router)

app.listen(process.env.PORT, ()=>{
    console.log("Server is listening on : " + process.env.PORT)
})