import XML from "xml-js";
import { error } from "../middlewares/logger/index.js";
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
        return json?.VAST?.Ad?.Wrapper[tag]?._cdata
    } else {
        error(` Could not retrieve VAST Tag URI, received: ${stringifiedData}`)
        return null;
    }
}

const handleSuccesfulResponse = (r) => {
    try {
        let jsonData = XML.xml2json(r, {compact:true})
        jsonData = JSON.parse(jsonData);
        if(jsonData == null || jsonData == undefined ) throw `ERROR: ${JSON.stringify(jsonData)}`
        const isSuccess = jsonData.VAST.hasOwnProperty('InLine')
        return isSuccess != null && isSuccess;
    } catch (e) {
        error(e)
    }
    
}

const baseFrom = (url) => {
    const urlToSplit = String(url).split('/')
    return urlToSplit[2]
}

export { getVastTag, baseFrom, handleSuccesfulResponse};