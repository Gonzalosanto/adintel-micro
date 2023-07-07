import XML from "xml-js";
import { error } from "../middlewares/logger/index.js";
import { mapImpressionsAndEvents } from "./impressions.utils.js";

const XML_VAST_AD_TAG = 'VASTAdTagURI';

const SUCCESFUL_TAGS = ['<Inline>','<MediaFiles>']

const COMMON_ERRORS = { //Body content expected when chain finishes...
    serverError : ['There are no ads', 'request was skipped'],
    brokenError : ['<VAST version= "2.0"></VAST>','<!DOCTYPE HTML PUBLIC','504 Service Unavailable'],
    expectedError : ['Campaign request limit exceed',]
}

/**
 * 
 * @param {String|Object} data string that represents the XML file's content. 
 * @returns VAST Tag URI from response body.
 */
const getVastTag = (data) => {
    const getURI = (d) => {
        let json = XML.xml2json(d, {compact:true})
        json = JSON.parse(json);
        return json?.VAST?.Ad?.Wrapper[tag]?._cdata
    }
    if(String(data).includes(XML_VAST_AD_TAG)){
        return getURI(data)
    } else {
        error("Could not retrieve any valuable data. Trying again . . .")
        return null;
    }
}
const handleBrokenResponse = (body) => { //Unfinished logic to handle responses
    return COMMON_ERRORS.brokenError.some(e => String(body).includes(e));
}
const handleErrorResponse = (body) => {
    return COMMON_ERRORS.serverError.some(e => String(body).includes(e));
}
const handleSuccesfulResponse = (body) => {
    return SUCCESFUL_TAGS.every(st => String(body).includes(st));
}
const getVASTTagURI = (data) => {
    return getVastTag(data) ?? null;
}
const buildHeaders = (options, reqHeaders) => {
    if(typeof options == 'object' && Object.hasOwn(options,'Cookies')) setCookies(options.Cookies, reqHeaders);
    return reqHeaders;
}
const setCookies = (cookies, headers) => {
    if(typeof headers != 'object'){throw  "invalid type of Headers"}
    if(typeof cookies != 'string'){throw "Invalid type of cookies"}
    headers.cookies = cookies
    return headers;
}
const baseFrom = (url) => {
    const urlObject = new URL(url);
    return urlObject.hostname;
}
const addIfXMLResponse = (body, XMLlist) => {
    if(!String(body).includes('<?xml version=')) return XMLlist;
    XMLlist.push(String(body))
    return XMLlist
}

const triggerImpressions = (chain) => {
    const jsChain = XML.xml2json(chain, {compact:true})
    console.log(jsChain)
    mapImpressionsAndEvents(jsChain)
    //FETCH impressions URL and events mapped by impression
}

export { getVASTTagURI, triggerImpressions, handleBrokenResponse, handleErrorResponse, handleSuccesfulResponse, buildHeaders, baseFrom, addIfXMLResponse };