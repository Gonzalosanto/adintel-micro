import { getRequest } from "./requests.controller.js";

const MINUTE = 60 * 1000;
const HOURS = (12*60);

export const runRequestsConcurrently = async (urls, concurrency) => {
    let startTime = Date.now();
    const promises = [];
    let index = 0;
    while ((Date.now() - startTime) < (HOURS * MINUTE)) {
        try {
            if(urls.length == index) index = 0
            for (let i = 0; promises.length < concurrency && index < urls.length; i++) {
                promises.push(getRequest(null, null, urls[index]))
                index++;
            }
            await Promise.all(promises);
            promises.length = 0; 
        } catch (error) {
            throw new Error(error)
        }
    }
}
