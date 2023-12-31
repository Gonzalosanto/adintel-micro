import { getRequest } from "./requests.controller.js";
import { isValidURL } from "../utils/http.js";
import { error, log } from "../middlewares/logger/index.js";
import { config } from '../../config/index.js'

const HOUR = 60 * 60 * 1000;
const options = {
    isLogging: process.env.NODE_ENV != 'production' && config.logging ? true : false,
    isDebugMode: process.env.NODE_ENV != 'production' ? true : false
};

export const runRequestsConcurrently = async (concurrency, hours) => {
    concurrency = concurrency ?? 100;
    hours = hours ?? (HOUR / 4)
    let startTime = Date.now();
    let index = 0;
    let begin = 0;
    const limit = Number.parseInt(concurrency);
    let urls;
    //REFACTOR CODE -> Handle messages inside consumer and push them into a queue that invokes for every item a chained HTTP request. 
    try {
        // TODO: handle any unexpected memory leak -> Retries could generate leaks...
        while ((Date.now() - startTime) < (hours * HOUR)) {
            urls = await urlsToRequest(begin, limit); //URLS TO REQUEST IS NOT VALID
            if (index >= length) {begin = 0;index = 0;}
            const promises = urls.filter(url => isValidURL(url)).map(url => getRequest(url, options));
            await Promise.allSettled(promises);
            index += urls.length;
            begin += limit;
        }
    } catch (err) {
        log("LOOP HAD AN EXCEPTION")
        error(err) 
    }    
    log('Loop finished');
};