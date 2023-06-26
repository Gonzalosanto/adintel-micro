import { saveDebug, saveError, saveResponse } from "../DAOs/fs/index.js";
import { info,error, warning } from '../middlewares/logger/index.js';
import { getHeadersFromResponse, getVastTag, handleSuccesfulResponse } from "../utils/http.js";



//Chaining requests, async function to get a chain
const getRequest = async (req,res,adserver) => {
    let tempURL = adserver;
    let eventChain = [];
    let isSuccesful = false; //Request is succesful when gets expected response
    let isCriticalError = false;
    let attempts = 0;
    let headers;
    let data = {};
    while (attempts < 10 && (!isSuccesful && !isCriticalError)) {
        try {
            warning(attempts)
            const response = await fetch(tempURL)
            const clone = response.clone();
            headers = getHeadersFromResponse(clone);
            data = {   
                date: new Date().toISOString(),
                request:{
                    url: tempURL,
                    headers: []
                },
                response : {
                    url: clone.url,
                    type: clone.type,
                    ok: clone.ok,
                    status: clone.status,
                    headers: headers, 
                },
                body: await clone.text(),
            }
            eventChain.push(data);
            tempURL = urlFromResponse(data);
            if(!data.response.ok){error(data.body); saveDebug(JSON.stringify(eventChain))};
            attempts++;
            info(`Status code: ${data.response.status}`)
            isSuccesful = handleSuccesfulResponse(data.body)
        } catch (err) {
            isCriticalError = true;
            saveError(JSON.stringify(eventChain));
            throw new Error(err);
        }
    }
    saveError(JSON.stringify(eventChain)); //Once the chain finishes append it into debug log
    return {status:200, statusText: "OK"};
}

const urlFromResponse = (data) => {
    const VastTagURI = getVastTag(data.body);
    if(data.response.status == 302 || data.response.status == 308) {return data.response.headers.location} 
    else if (VastTagURI) {return VastTagURI} 
    else {error("Could not retrieve any valuable data. Trying again . . ."); return data.request.url;}
}

export {getRequest}