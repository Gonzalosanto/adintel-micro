import { getRequest } from "./requests.controller.js";
import { GetMacrosLength } from '../services/macros.service.js'
import { urlsToRequest } from '../utils/builder.utils.js'
import { isValidURL } from "../utils/http.js";
import { error, log } from "../middlewares/logger/index.js";

const HOUR = 60 * 60 * 1000;

export const runRequestsConcurrently = async (concurrency, hours) => {
    let startTime = Date.now();
    let index = 0;
    let begin = 0;
    const limit = Number.parseInt(concurrency);
    const length = await GetMacrosLength();
    let urls;

    const handlePromises = async (promises) => {
        try {
            await Promise.allSettled(promises);
        } catch (error) {
            throw new Error(error);
        }
    };

    try {
        while ((Date.now() - startTime) < (hours * HOUR)) {
            urls = await urlsToRequest(begin, limit);
            if (index >= length) {begin = 0;index = 0;}
            const promises = [];
            for (let i = 0; promises.length < urls.length && promises.length < concurrency && index < length; i++) {
                if (isValidURL(urls[i])) promises.push(getRequest(urls[i]));
            }
            await handlePromises(promises);
            index += urls.length;
            begin += limit;
        }
    } catch (err) {
        log("LOOP HAD AN EXCEPTION")
        error(err) 
    }    
    log('Loop finished');
};