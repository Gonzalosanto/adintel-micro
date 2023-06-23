// import { getRequest } from "../../controllers/requests.controller";
// import { templateURL } from '../../config/index.js';
import { parse } from "csv-parse";
import fs from "fs"
import path from "path";

const processFile = async () => {
    const records = [];
    const parser = fs.createReadStream(path.join(process.cwd(), "./docs/sample.txt")).pipe(parse({
        delimiter:';',
        skip_records_with_empty_values:true,
        skip_records_with_error:true
    }));
    for await (const record of parser){
        records.push(record)
    }
    return records;
}

const start = async (req,res, next) => {
    try {
        const values = await processFile();
        console.log(values);
    } catch (error) {
        console.error(error)
    }


    //getRequest(req,res, templateURL)
}
const abort = (req,res, next) => {
    process.exit();
}

export { start, abort }