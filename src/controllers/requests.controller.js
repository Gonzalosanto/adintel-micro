import { saveDebug, saveError, saveResponse } from "../DAOs/fs/index.js";
import { info,error, warning, debug } from '../middlewares/logger/index.js';
import { getVastTag, handleSuccesfulResponse, baseFrom } from "../utils/http.js";
import fetch from "node-fetch";

//Chaining requests, async function to get a chain
const getRequest = async (req,res,adserver) => {
    const setRequestHeaders = (searchParams) => {
        const params = Object.fromEntries(searchParams)
        const headers = {
            'Connection': 'keep-alive',
            'Accept': `*/*`,
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Forwarded-For': params.uip || '',
            'Referer': decodeURIComponent(params.app_store_url) || '',
            'Origin': baseFrom(decodeURIComponent(params.app_store_url)) || '',
            'Host': '', //implicit header
            'User-Agent': params.ua,
        }
        return headers;
    }

    let cookies = [];
    const params = new URL(adserver).searchParams;
    const reqHeaders = setRequestHeaders(params)
    let request = new Request(adserver)
    let eventsChain = {
        eventChain : [],
        isSuccesful: false,
        isCriticalError: false,
        attempts: 0
    }
    let resHeaders;
    let data = {};
    while (eventsChain.attempts < 4 && (!eventsChain.isSuccesful && !eventsChain.isCriticalError)) {
        try {
            const response = await fetch(request.url, {
                redirect:'follow',
                headers: reqHeaders,
            })
            const clone = response.clone();
            cookies = clone.headers.get('Set-Cookie') ? clone.headers.get('Set-Cookie') : ''
            cookies = cookies.split(';')[0]
            resHeaders = JSON.stringify(clone.headers);
            data = {   
                date: new Date().toISOString(),
                request:{url:request.url,
                    headers:reqHeaders,
                },
                response : {
                    url: clone.url,
                    type: clone.type,
                    ok: clone.ok,
                    status: clone.status,
                    headers: resHeaders, 
                },
                error: '',
                body: await clone.text(),
            }
            eventsChain.eventChain.push(data);
            if(clone.ok){
                request = buildRequest(getVASTTagURI(data),{
                    'Cookies': cookies,
                }, setRequestHeaders(params))

                eventsChain.isSuccesful = handleSuccesfulResponse(data.body)
            }
            if(clone.status == 302 || clone.status == 301) {
                warning(`Redirection! Location found: ${data.response.headers.location}`);
                handleRedirection(clone, reqHeaders);
            }
            if(!clone.ok && !clone.redirected){
                error({request: data.request, response: data.response, body: data.body});
                saveDebug(JSON.stringify(eventsChain.eventChain))
            };
            eventsChain.attempts++;
        } catch (err) {
            data.error = err;
            eventsChain.eventChain.push(data);
            eventsChain.isCriticalError = handleError(err, eventsChain.isCriticalError)
            saveError(JSON.stringify(eventsChain.eventChain));
            eventsChain.attempts++;
            error(err);
            //throw new Error(err);
        }
    }
    saveError(JSON.stringify(eventsChain.eventChain)); //Once the chain finishes append it into debug log
    return {};
}

const handleRedirection = (response, headers) => {
    const redirectUrl = response.headers.get('Location');
    if (redirectUrl) {
        buildRequest(redirectUrl, headers)
    }
}

const handleError = (error, flag) => {
    return flag = isCriticalError(error)
}

const isCriticalError = (error) => {
    //TODO: Validar los casos de errores fatales en las peticiones...
    error(error)
    return false
}

const getVASTTagURI = (data) => {
    const VastTagURI = getVastTag(data.body);
    if (VastTagURI) {return VastTagURI}
    else {error("Could not retrieve any valuable data. Trying again . . ."); return data.request.url;}
}

const buildRequest = (url, options, reqHeaders) => {
    if(typeof options == 'object' && Object.hasOwn(options,'Cookies')) setCookies(options.Cookies, reqHeaders) 
    const newRequest = new Request(url, {       
        headers: reqHeaders,
    });
    return newRequest;
}

const setCookies = (cookies, headers) => {
    if(typeof headers != 'object'){throw  "invalid type of Headers"}
    if(typeof cookies != 'string'){throw "Invalid type of cookies"}
    headers.cookies = cookies
    return headers;
}

/*https://s.adtelligent.com/
?
width=320
&height=480
&cb=1275224511
&ua=Mozilla%2F5.0%20%28Linux%3B%20Android%208.0.0%3B%20SAMSUNG-SM-G930A%20Build%2FR16NW%3B%20wv%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Version%2F4.0%20Chrome%2F88.0.4324.181%20Mobile%20Safari%2F537.36
&uip=73.130.87.123
&app_name=KMTV%20-%20Watch%20K-Pop&app_bundle=com.dmr.kmtv
&device_model=samsung
&device_make=Samsung
&device_category=2
&app_store_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.dmr.kmtv
&device_id=698b1596-4239-402b-b934-c4ebb8d99c98
&vast_version=2
&aid=831205*/


export {getRequest}