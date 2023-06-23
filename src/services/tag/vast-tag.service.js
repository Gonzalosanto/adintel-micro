import XML from 'xml-js';
import { save, saveError, saveResponse } from "../../DAOs/fs/index.js";
import { info,error } from '../../middlewares/logger/index.js';

//Chaining requests, async function to get a chain
const getRequest = async (adserver) => {
    let url = adserver;
    let eventChain = [];
    let stopLoop = 0;

    while (stopLoop<10) { //Hay que definir condicion adecuada de corte
        info(`Requesting to: ${url} to get any response from adserver:`)
        const response = await fetch(url)
        const clone = response.clone();
        const xmlString = await clone.text();
        const headers = getHeadersFromResponse(clone);
        eventChain.push(
            {   date: new Date().toISOString(),
                response : {
                url: clone.url,
                type: clone.type,
                status: clone.status,
                headers: headers, 
            },
            body: xmlString});
        if(!clone.ok) {
            error(xmlString)
            saveError(JSON.stringify(eventChain));
            return {status:clone.status, statusText: clone.statusText};
        }
        const VastTagURI = getVastTag(xmlString);
        stopLoop ++;
        if(headers.location){url = headers.location;} 
        else if (VastTagURI) {url = VastTagURI;} 
        else {return({error: "Undefined URL"});}
    }
    saveResponse(JSON.stringify(eventChain)); //Once the chain finishes append it into debug log
    return {status:200, statusText: "OK"};
}

/**
 * 
 * @param {String|Object} data string that represents the XML file's content. 
 * @returns VAST Tag URI from response body.
 */
const getVastTag = (data) => {
    const tag = "VASTAdTagURI";
    const stringifiedData = String(data);
    let json;
    if(stringifiedData.includes(tag)){
        json = XML.xml2json(data, {compact:true})
        json = JSON.parse(json);
        return json.VAST.Ad.Wrapper[tag]._cdata
    } else {
        error(` Could not retrieve VAST Tag URI, received: ${stringifiedData}`)
        return 
    }
}

const getHeadersFromResponse = (r) => {
    let h = {};
        for(let header  of r.headers.entries()){
            h[header[0]] = header[1];
        }
    return h;
}

export {getRequest}