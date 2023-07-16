import { parse } from "csv-parse";
import fs from "fs"
import path from "path";
import { error } from "../middlewares/logger/index.js";
import {AID, BASE_URL} from "../../config/index.js"

const VAST_VERSION = {
    '2' : '2.0',
    '4' : '4.2'
}

const DIMENSIONS = {
    '16:9':{
        FHD : {width: 1920, height: 1080},
        HD : {width: 1280, height: 720}
    }
}

const CATEGORY = {
    MOBILE: 1,
    DESKTOP: 2,
    WEB: 3,
    CTV : 4
}

const macros = {
    width : DIMENSIONS["16:9"].FHD.width,
    height : DIMENSIONS["16:9"].FHD.height,
    cb :  '', //Se puede completar con el primer response
    ua : '', //user agent 
    uip: '', //Como setear este param? Investigar...
    app_name:'',
    app_bundle:'',
    device_model:'', //No provisto
    device_make:'', //Inferir del store o UA provisto
    device_category: CATEGORY.CTV,
    app_store_url:'',
    device_id:'', //parametro que apunta a dispositivo unico. NO SETEARLO
    vast_version: VAST_VERSION[4],
}

//este es la URL con el orden adecuado de las macros: 
//http://s.adtelligent.com/?width=[replace_me]&height=[replace_me]
//&cb=[replace_me]&ua=[replace_me]&uip=[replace_me]&app_name=[replace_me]&app_bundle=[replace_me]
//&device_model=[replace_me]&device_make=[replace_me]&device_category=[replace_me]&app_store_url=[replace_me]
//&device_id=[replace_me]&vast_version=2&aid=833181 

export const processFile = async (filename, delimiter) => {
    const records = [];
    const parser = fs.createReadStream(path.join(process.cwd(), filename)).pipe(parse({
        delimiter:delimiter || ',',
        skip_records_with_empty_values:true,
        skip_records_with_error:true
    }));
    for await (const record of parser){
        records.push(record)
    }
    return records;
}

const setMacros = (url, id, keys, data) => {
    let entries = []    
    if (typeof url !== 'string' ||typeof data !== 'object' || typeof keys !== 'object') {
        throw new Error('Invalid input parameters');
    }
    Object.values(data).forEach((d,i) =>{
        entries.push([keys[i],d])
    })
    entries = Object.fromEntries(entries);
    let urlWithMacros = `${url}/?width=${DIMENSIONS["16:9"].FHD.width}&height=${DIMENSIONS["16:9"].FHD.height}&cb=&ua=${entries.ua}&uip=${entries.uip}&app_name=${entries.app_name}&app_bundle=${entries.app_bundle}&device_model=&device_make=&device_category=${CATEGORY.CTV}&app_store_url=${encodeURIComponent(entries.app_store_url)}&device_id=${entries.device_id || ''}&vast_version=${VAST_VERSION[2]}&aid=${id}`;
    try {return urlWithMacros.toString();}
    catch (err) {error('Error processing macros:', err);return null;}
}
// Es temporal, se supone que los datos llegan en el request del core-service
export const processData = (baseUrl, id, data) => {
    const urls = [];
    const keys = data[0] //el indice 0 solo tiene las keys del CSV, el resto son valores
    for (let i = 1; i < data.length; i++) {
        urls.push(setMacros(baseUrl, id, keys, data[i]))
    }
    return urls;
}

//BASE URL and AID are data that comes from POST request or GET request from CORE Backend
export const getURLsWithMacros = async (url, id, filename) => {
    const fileContent = await processFile(filename, ',')
    return processData(BASE_URL, AID, fileContent)
}