import { error, log } from '../middlewares/logger/index.js';
import { getVASTTagURI, handleBrokenResponse, handleErrorResponse, handleSuccesfulResponse, addIfXMLResponse } from "../utils/http.js";
import fetch from "node-fetch";
import { trigger } from "../utils/impressions.utils.js";

const TIMEOUT_MS = process.env.TIMEOUT_MS || 5000;
const getRequest = async (urlWithMacros) => {
    let url = setCachebuster(urlWithMacros);
    const params = new URL(url).searchParams;
    const reqHeaders = setRequestHeaders(params);
    let cookies = [];
    let eventsChain = {
        eventChain : [], // this field is for logging purposes. If empty, no logging is active.
        XMLChain : {impressions:[], events:[]},
        previousURL:url,
        isSuccesful: false,
        isBroken: false,
        isCriticalError: false,
        isCommonError: false,
    }

    while ((!eventsChain.isBroken && !eventsChain.isCriticalError && !eventsChain.isSuccesful)){
        const controller = new AbortController();
        const timeout = setTimeout(()=>{controller.abort("TIMEDOUT")}, TIMEOUT_MS)
        try {
            let options = {
                redirect:'follow',
                headers: reqHeaders,
                signal: controller.signal
            }
            const response = await fetch(url, options);
            if(response.status >= 400){
                handleErrorResponse(response.body);
                clearTimeout(timeout)
                break;
            }
            cookies = response.headers.get('Set-Cookie')?.split(';')[0] || '';
            eventsChain.previousURL = url
            if(response.status == 200){
                options.headers['Cookies'] = cookies
                url = chainRequest(await response.text(), eventsChain);
            }
            clearTimeout(timeout)
        } catch (err) {
            if(err.name == 'AbortError') error(`${new Date().toISOString()} => ${err.message}`)
            if(err.name == 'FetchError') error(`${new Date().toISOString()} => ${err.message}`)
            else error(`${err.name}: ${err.message}`)
        }
    }
    if(eventsChain.isSuccesful) {
        await handleSuccesfulChain(eventsChain)
    };
    return eventsChain
}

const chainRequest = (body, eventsChain) => {
    eventsChain.XMLChain = addIfXMLResponse(body, eventsChain.XMLChain);
    eventsChain = handleResponse(body, eventsChain);
    return handleURLAfterResponse(body, eventsChain);
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
    log(`${new Date().toISOString()} --- Cadena Exitosa`)
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