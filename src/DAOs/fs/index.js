import fs from "fs";
import * as path from 'path';
import { currentDate } from "../../utils/date.js";
import { error, info } from "../../middlewares/logger/index.js";

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
    writeDataIf(data, file);
}
/**
 * For development purpose and debugging only intended function
 * @param {String} data  
 */
const saveResponse = (data) => {
    let logPath = path.join(root, `./public/debug/response.xml`);
    writeDataIf(data, logPath)
}

const saveDebug = (data) => {
    let logPath = path.join(root, `./public/debug/debug.xml`);
    writeDataIf(data, logPath)
}
/**
 * For development purpose and debugging only intended function
 * @param {String} data  
 */
const saveError = (data) => {
    let logPath = path.join(root, `./public/debug/errors.xml`);
    writeDataIf(data, logPath);
}
const saveChain = (data) => {
    let logPath = path.join(root, `./public/debug/chains.xml`);
    writeDataIf(data, logPath);
}

const writeDataIf = (data, file) => {
    if(fs.existsSync(file)){
        fs.appendFile(file, data, (e)=> {
            if(e) throw e;
            info(`Data appended to: ${file}`)
        })
    } else {
        fs.writeFile(file, data, (e)=> {
            if(e) throw e;
            info(`File: ${file} written`)
        });
    }
}

export { saveDebug, saveChain, saveResponse, saveError }