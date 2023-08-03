import fs from "fs"
import path from "path";
import { parse } from 'csv-parse';
import { macros } from './config.js'
import { Insert } from '../../services/macros.service.js'

const Keys = ['app_bundle','app_name','app_store_url','device_id','ua','uip']
/**
 * 
 * @param {String} url 
 * @param {String} id 
 * @param {Array<String>} keys 
 * @param {Array<String>} data 
 * @returns a String that represents an URI with macros keys and respectives values.
 */
const setMacros = (url, id, keys, data) => {
    let entries = []    
    if (typeof data !== 'object' || typeof keys !== 'object') {
        throw new Error('Invalid input parameters');
    }
    Object.values(data).forEach((d,i) =>{entries.push([keys[i],d])})
    entries = Object.fromEntries(entries);
    const dataToSave = {
        baseUrl: process.env.BASE_URL,
        height: macros.height,
        width: macros.width,
        ...entries
    }
    try {
        return dataToSave
    }
    catch (err) {console.error('Error processing macros:', err);return null;}
}
/**
 * 
 * @param {String} baseUrl 
 * @param {String} id 
 * @param {Array<String>} data 
 * @returns an array of String that represents a list of urls with set VAST TAG macros.
 */
export const processData = async (baseUrl, id, data) => {
    const urls = [];
    for (let i = 0; i < data.length; i++) {
        await Insert(setMacros(baseUrl, id, Keys, data[i]))
        //urls.push(result.url)
    }
    return []; 
}

/**
 * 
 * @param {String} filename It's the relative path from root where it's stored the file to read. 
 * @param {String} delimiter Receives a character that represents the delimiter in CSV file (example: ',' or ';') 
 * @returns An Array where each row represents all the macros used to build final URI
 */
export const processFile = async (filename, delimiter) => {
    const processRecords = async (d) => {
            return processData(null, null, d)
    }
    const records = [];
    const parser = fs.createReadStream(path.join(process.cwd(), filename)).pipe(
        parse({
            delimiter:delimiter || ',',
            skip_records_with_empty_values:true,
            skip_records_with_error:true
        })
    );
    for await (const record of parser){
        if(records.length == 5000){
            processRecords(records);
            records.length = 0;
        }
        records.push(record)
    }
    processRecords(records);
    return records;
}

//SEPARATE LOGIC, FILE PROCESSING 'n URL building 