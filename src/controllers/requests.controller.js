import { info,error, warning, debug, log } from '../middlewares/logger/index.js';
import { getVASTTagURI,handleBrokenResponse, handleErrorResponse, handleSuccesfulResponse, addIfXMLResponse } from "../utils/http.js";
import fetch from "node-fetch";
import { trigger } from "../utils/impressions.utils.js";

//SET state machine to handle every request state during loop life cycle
// const stateMachine = {
//     initial: 'start',
//     states: {
//         start: {
//             on: {
//                 RESPONSE_200: 'success',
//                 RESPONSE_ERROR: 'error',
//                 RESPONSE_BROKEN: 'broken',
//                 RESPONSE_CRITICAL_ERROR: 'criticalError'
//             }
//         },
//         success: {
//             onEntry: 'handleSuccess'
//         },
//         error: {
//             onEntry: 'handleError'
//         },
//         broken: {
//             onEntry: 'handleBroken'
//         },
//         criticalError: {
//             onEntry: 'handleCriticalError'
//         }
//     }
// }

const getRequest = async (urlWithMacros) => {
    const controller = new AbortController()
    let url = setCachebuster(urlWithMacros);
    const params = new URL(url).searchParams;
    const reqHeaders = setRequestHeaders(params);
    const timeout = abortHandler(5000, controller)
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
    while ((!eventsChain.isBroken && !eventsChain.isCriticalError) && retries <= 5){
        try {
            let options = {
                redirect:'follow',
                headers: reqHeaders,
                signal : controller.signal,
            }
            const response = await fetch(url, options);
            cookies = response.headers.get('Set-Cookie')?.split(';')[0] || '';
            const data = await dataToLog(reqHeaders, response, url);
            eventsChain.previousURL = url
            eventsChain.eventChain.push(data);
            if(response.status == 200){
                options.headers['Cookies'] = cookies
                url = chainRequest(response, eventsChain);
            } else { 
                break;
             }
            retries++;
            clearTimeout(timeout)
        } catch (err) {
            error(`${new Date().toISOString()} => ${err}`)
            eventsChain.isCriticalError = true;
            clearTimeout(timeout)
        }
    }
    if(eventsChain.isSuccesful) {eventsChain = await handleSuccesfulChain(eventsChain)};
    return eventsChain
}

const chainRequest = (response, eventsChain) => {
    eventsChain.XMLChain = addIfXMLResponse(response, eventsChain.XMLChain);
    eventsChain = handleResponse(response, eventsChain);
    return handleURLAfterResponse(response, eventsChain);
}

const abortHandler = (timeoutMs, controller)=>{    
    const timeout = setTimeout(()=>controller.abort(), timeoutMs);
    return timeout;
}

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

const setCachebuster = (url) => {
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const cb = getRandomIntInclusive(1111111111,9999999999);
    const urlWithCB = new URL(url)
    urlWithCB.searchParams.set("cb", cb)
    return urlWithCB.toString()
}

const handleURLAfterResponse = (data, options) => {
    let url = getVASTTagURI(data);
    if(!url) {options.isBroken = true}
    if(url==options.previousURL) {options.isBroken = true}
    return url;
}

const handleSuccesfulChain = async (chain) => {
    const res = await trigger(chain.XMLChain)
    chain.eventChain.push(JSON.stringify(res))
    console.log(`${new Date().toISOString()} --- Cadena Exitosa`)
    return chain
}

const handleResponse = (body, chain) => {
    chain.isBroken = handleBrokenResponse(body);
    chain.isCommonError = handleErrorResponse(body);
    chain.isSuccesful = handleSuccesfulResponse(body);
    return chain;
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