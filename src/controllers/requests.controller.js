import { saveDebug, saveError, saveChain, saveResponse } from "../DAOs/fs/index.js";
import { info,error, warning, debug } from '../middlewares/logger/index.js';
import { getVASTTagURI,handleBrokenResponse, handleErrorResponse, handleSuccesfulResponse, buildHeaders, baseFrom, addIfXMLResponse } from "../utils/http.js";
import fetch from "node-fetch";
import { trigger } from "../utils/impressions.utils.js";

//Chaining requests, async function to get a chain
const getRequest = async (req,res,urlWithMacros) => {
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
    const controller = new AbortController()
    const timeout = setTimeout(()=>controller.abort(), 5000);
    let url = setCachebuster(urlWithMacros);
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
                signal : controller.signal,
            }
            const response = await fetch(url, options);
            cookies = response.headers.get('Set-Cookie')?.split(';')[0] || '';
            data = await dataToLog(reqHeaders, response, url);
            eventsChain.previousURL = url
            eventsChain.eventChain.push(data);
            if(response.status == 200){
                options.headers['Cookies'] = cookies
                eventsChain.XMLChain = addIfXMLResponse(data.body, eventsChain.XMLChain);
                eventsChain = handleResponse(data.body, eventsChain);
                // console.log(data.body)
                url = handleURLAfterResponse(data.body, eventsChain);
            }
            retries++;
            clearTimeout(timeout)
        } catch (err) {
            //Try to make request and handle any error that comes out
            retries++;
            data.error = err;
            //error(`${new Date().toISOString()} -/- ${err}`)
            eventsChain.isCriticalError = true;
            //eventsChain.eventChain.push(data);
            clearTimeout(timeout)
        }
    }
    if(eventsChain.isSuccesful) {
        eventsChain = await handleSuccesfulChain(eventsChain)
    };
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
    console.log(`${new Date().toISOString()} --- Cadena Exitosa`)
    const res = await trigger(chain.XMLChain)
    chain.eventChain.push(JSON.stringify(res))
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