import express from 'express';
const app = express();
import 'dotenv/config'
import { router } from "./src/routes/index.js"

app.use(router)

app.listen(process.env.PORT, ()=>{
    console.log("Server is listening on : " + process.env.PORT)
})

/**
 * Gets info from 
 * @param {String} filename filepath of CSV file
 * @returns A boolean that represents if the file was read before to get data.
 */
const checkIfFileWasRead = (filename) => {
    //consulta a la base de datos retorna el nombre del archivo leido y algun flag unico
    return true
}