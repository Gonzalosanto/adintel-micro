import fs from "fs";
import * as path from 'path';
import { currentDate } from "../../utils/date.js";

const root = process.cwd();
/**
 * 
 * @param {String} data, body response or response stringified 
 * @param {String} file path to write the data
 * @param {String} format choose any format from OPTIONS to save data (OPTIONS: XML, TXT)
 */
const save = (data, file, format) => {
    if(!file) file = path.join(root, `./public/logs/response.${format}`)
    if(String(data).includes("ServerError")) file = path.join(root, `./public/logs/${currentDate()}_error.txt`);
    console.log(`Saving data to : ${file}`);
    console.log()
    if(fs.existsSync(logPath)){
        fs.appendFileSync(logPath, data)
    } else {
        fs.writeFileSync(logPath, data);
    }
}
/**
 * For development purpose and debugging only intended function
 * @param {String} data  
 */
const saveResponse = (data) => {
    let logPath = path.join(root, `./public/debug/response.xml`);
    if(fs.existsSync(logPath)){
        fs.appendFileSync(logPath, data)
    } else {
        fs.writeFileSync(logPath, data);
    }
}

/**
 * For development purpose and debugging only intended function
 * @param {String} data  
 */
const saveError = (data) => {
    let logPath = path.join(root, `./public/debug/errors.xml`);
    if(fs.existsSync(logPath)){
        fs.appendFileSync(logPath, data)
    } else {
        fs.writeFileSync(logPath, data);
    }
}




export { save, saveResponse, saveError }