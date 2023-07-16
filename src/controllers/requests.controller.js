import { saveDebug, saveError, saveChain, saveResponse } from "../DAOs/fs/index.js";
import { info,error, warning, debug } from '../middlewares/logger/index.js';
import { getVASTTagURI,handleBrokenResponse, handleErrorResponse, handleSuccesfulResponse, buildHeaders, baseFrom, addIfXMLResponse } from "../utils/http.js";
import fetch from "node-fetch";
import { trigger } from "../utils/impressions.utils.js";

//Chaining requests, async function to get a chain
const getRequest = async (req,res,adserver) => {
    const setRequestHeaders = (searchParams) => {
        const params = Object.fromEntries(searchParams)
        const headers = {
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':true,
            'Accept': `*/*`,
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Forwarded-For':params.uip || '',
            'User-Agent': params.ua || '',
        }
        return headers;
    }
    let url = adserver;
    const params = new URL(url).searchParams;
    const reqHeaders = setRequestHeaders(params);
    let retries = 0;
    let cookies = [];
    let eventsChain = {
        eventChain : [],
        XMLChain : {impressions:[], events:[]},
        previousURL:url,
        isSuccesful: false,
        isBroken: false,
        isCriticalError: false,
        isCommonError: false,
    }
    let data = {};
    while ((!eventsChain.isBroken && !eventsChain.isCriticalError) && retries <= 5){
        try {
            let options = {
                redirect:'follow',
                headers: reqHeaders,
            }
            const response = await fetch(url, options);
            cookies = response.headers.get('Set-Cookie')?.split(';')[0] || '';
            data = await dataToLog(reqHeaders, response, url);
            eventsChain.previousURL = url
            eventsChain.eventChain.push(data);
            if(response.status == 200){
                options.headers['Cookies'] = cookies
                eventsChain.XMLChain = addIfXMLResponse(data.body, eventsChain.XMLChain)
                eventsChain.isBroken = handleBrokenResponse(data.body);
                eventsChain.isCommonError = handleErrorResponse(data.body);
                eventsChain.isSuccesful = handleSuccesfulResponse(data.body);
                url = handleURLAfterResponse(data.body, eventsChain);
            }
            retries++;
        } catch (err) {
            retries++;
            data.error = err;
            error(err)
            eventsChain.isCriticalError = true;
            eventsChain.eventChain.push(data);
        }
    }
    if(eventsChain.isSuccesful) {
        const res = await trigger(eventsChain.XMLChain)
        eventsChain.eventChain.push(JSON.stringify(res))
        saveChain(JSON.stringify(eventsChain.eventChain))
    };
    return {};
}

const handleURLAfterResponse = (data, options) => {
    let url = getVASTTagURI(data);
    if(!url) {options.isBroken = true}
    if(url==options.previousURL) {options.isBroken = true}
    return url;
}

/**
 *
 * 
 * @param {object} requestHeaders 
 * @param {Response} response Receives a Response object
 * @param {String} requestURL 
 * @returns 
 */
const dataToLog = async (requestHeaders, response, requestURL) => {
    const data = {
        date: new Date().toISOString(),
        request:{
            url:requestURL,
            headers:requestHeaders,
        },
        response : {
            url: response.url,
            type: response.type,
            ok: response.ok,
            status: response.status,
            headers: JSON.stringify(response.headers),
        },
        error: '',
        body: await response.text(),
    }
    return data;
}

export { getRequest }