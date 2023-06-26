import { parse } from "csv-parse";
import fs from "fs"
import path from "path";
import { error } from "../middlewares/logger/index.js";
import { getRequest } from "../controllers/requests.controller.js";

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

const processFile = async (filename) => {
    const records = [];
    const parser = fs.createReadStream(path.join(process.cwd(), filename)).pipe(parse({
        delimiter:';',
        skip_records_with_empty_values:true,
        skip_records_with_error:true
    }));
    for await (const record of parser){
        records.push(record)
    }
    return records;
}

const processMacros = (url, id, keys, data) => {
    if (typeof url !== 'string' || typeof data !== 'object' || typeof keys !== 'object') {
        throw new Error('Invalid input parameters');
    }

    let urlWithMacros = new URL(url);
    Object.values(data).forEach((field, i) => {
        if(i<6 && keys[i] != 'device_id'){
            urlWithMacros.searchParams.set(keys[i], field);
        }
        urlWithMacros.searchParams.set('width', macros.width)
        urlWithMacros.searchParams.set('height', macros.height)
        urlWithMacros.searchParams.set('aid', id);
        urlWithMacros.searchParams.set('device_category', macros.device_category)
    });

    try {
        return urlWithMacros.toString();
    } catch (err) {
        error('Error processing macros:', err);
        return null;
    }
}
// Es temporal, se supone que los datos llegan en el request del core-service
export const processData = (url, id, data) => {
    const urls = [];
    const keys = data[0] //el indice 0 solo tiene las keys del CSV, el resto son valores     const urls = [];
    for (let i = 1; i <= 10; i++) { 
        urls.push(processMacros(url, id, keys, data[i]))   
    }
    return urls;
}

export const getURLsWithMacros = async (url, id, filename) => {
    const d = await processFile('./docs/sample.txt')
    return processData('http://s.adtelligent.com','833131', d)
}
