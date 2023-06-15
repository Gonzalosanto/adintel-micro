import fs from "fs";
import * as path from 'path';
import { currentDate } from "../../utils/date";
const save = (res) => {
    let logPath = path.join(path.dirname('./'), `./public/logs/${currentDate()}_response.txt`);
    if(res.contains("ServerError")){
        logPath = path.join(path.dirname('./'), `./public/logs/${currentDate()}_error.txt`);
    }
    console.log("Saving data to path..." + logPath)
    if(fs.existsSync){
        fs.appendFileSync(logPath, res)
    } else {
        fs.writeFileSync(logPath, res);
    }
}

export { save }