import { getRequest } from "./requests.controller.js";
import { GetMacrosLength } from '../services/macros.service.js'
import {urlsToRequest} from '../utils/builder.utils.js'

const HOUR = 60 * 60 * 1000;

export const runRequestsConcurrently = async (concurrency, hours) => {
    let startTime = Date.now();
    const promises = [];
    let index = 0;
    let begin = 0;
    const limit = Number.parseInt(concurrency);
    const length = await GetMacrosLength();
    let urls;
    while ((Date.now() - startTime) < (hours * HOUR)) {
        try {
            urls = await urlsToRequest(begin, limit)
            if(index >= length) {
                begin = 0; index=0;
            }
            for (let i = 0; promises.length < concurrency && index < length; i++) {
                promises.push(getRequest('','',urls[i]))
            }
            await Promise.all(promises);
            index+=urls.length;
            begin += limit;
            promises.length = 0;
        } catch (error) {
            console.log("Process exited with error code: F")
            throw new Error(error)
        }
    }
    console.log('Loop exited')
}
