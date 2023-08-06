import XML from "xml-js";
import { error, debug } from "../middlewares/logger/index.js";
import { getImpressionsAndEvents } from "./impressions.utils.js";

const XML_VAST_AD_TAG = 'VASTAdTagURI';

const SUCCESFUL_TAGS = ['<InLine>','<MediaFiles>']

const COMMON_ERRORS = { //Body content expected when chain fails...
    serverError : ['There are no ads', 'request was skipped'],
    brokenError : ['<!DOCTYPE HTML PUBLIC','504 Service Unavailable'],
    expectedError : ['Campaign request limit exceed',]
}
//---------------------VAST-TAG-URI-------------------------------
/**
 * 
 * @param {String|Object} data string that represents the XML file's content. 
 * @returns VAST Tag URI from response body.
 */
const getVastTag = (data) => {
    const getURI = (d) => {
        let json = XML.xml2json(d, {compact:true})
        json = JSON.parse(json);
        return json?.VAST?.Ad?.Wrapper[XML_VAST_AD_TAG]?._cdata
    }
    if(String(data).includes(XML_VAST_AD_TAG)){
        return getURI(data)
    } else {
        return null;
    }
}
const getVASTTagURI = (data) => {
    return getVastTag(data) ?? null;
}
//-------------------HTTP-RESPONSE-HANDLERS------------------------
const handleBrokenResponse = (body) => {
    return COMMON_ERRORS.brokenError.some(e => String(body).includes(e));
}
const handleErrorResponse = (body) => {
    return COMMON_ERRORS.serverError.some(e => String(body).includes(e));
}
const handleCommonResponse = (body) => {
    return COMMON_ERRORS.expectedError.some(e => String(body).includes(e));
}
const handleSuccesfulResponse = (body) => {
    return SUCCESFUL_TAGS.some(st => String(body).includes(st));
}
//------------------HTTP-AUXILIAR-FUNCTIONS--------------------
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
//------------XML-DATA------------------
const isXML = (body) => {
  const xmlRegex = /<\?xml.*\?>/i;
  return xmlRegex.test(body);
};
const addIfXMLResponse = (body, XMLlist) => {
    let newXmlList;
    if (!isXML(body)) {return XMLlist}
    else newXmlList = extractDataFrom(body, XMLlist);
    return newXmlList;
};
const extractDataFrom = (xml, chain) => {
    const jsChain = XML.xml2js(xml, {compact:true})
    return getImpressionsAndEvents(jsChain, chain)
}
//-------------URL-----------------------
const isValidURL = (string) => {
    let url;  
    try {
      url = new URL(string);
      return url.protocol && url.hostname && url.href
    } catch (err) {
        return false;
    }
}

export { getVASTTagURI, isValidURL, extractDataFrom , handleBrokenResponse, handleErrorResponse, handleCommonResponse, handleSuccesfulResponse, buildHeaders, baseFrom, addIfXMLResponse };