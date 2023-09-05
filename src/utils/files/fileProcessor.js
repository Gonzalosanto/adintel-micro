import fs from "fs"
import path from "path";
import { parse } from 'csv-parse';
import { macros } from './config.js'
import { BulkInsertAppBundle, BulkInsertAppNames, BulkInsertAppStore, BulkInsertOS, BulkInsertDeviceID, BulkInsertUserAgent, BulkInsertUserIP} from '../../services/vast.service.js'
import { InsertManyMacros } from '../../services/macros.service.js'

const Keys = ['app_bundle', 'app_name', 'app_store_url', 'device_id', 'ua', 'uip']
/**
 * 
 * @param {String} url 
 * @param {String} id 
 * @param {Array<String>} keys 
 * @param {Array<String>} data 
 * @returns an object that contains as keys the macros tags and respectives values from file data.
 */
const setMacros = (keys, data) => {
    let entries = []
    if (typeof data !== 'object' || typeof keys !== 'object') {
        throw new Error('Invalid input parameters');
    }
    Object.values(data).forEach((d, i) => { if (keys[i]) entries.push([keys[i], d]) })
    entries = Object.fromEntries(entries);
    const dataToSave = {
        ...entries
    }
    try {
        return dataToSave
    }
    catch (err) { console.error('Error processing macros:', err); return null; }
}
/**
 * 
 * @param {String} baseUrl 
 * @param {String} id 
 * @param {Array<String>} data 
 * @returns an array of String that represents a list of urls with set VAST TAG macros.
 */
export const processData = async (data) => {
    try {
        let macros = []
        let index = 0;
        while (index < data.length) {
            for (let i = index; i < 1000 + index; i++) {
                if (data[i]) {
                    macros.push(setMacros(Keys, data[i]))
                    index++;
                }
            }
            await InsertManyMacros(macros)
            macros.length = 0
        }
    } catch (error) {
        console.log(error)
    }
}
/**
 * 
 * @param {String} filename It's the relative path from root where it's stored the file to read. 
 * @param {String} delimiter Receives a character that represents the delimiter in CSV file (example: ',' or ';') 
 * @returns An Array where each row represents all the macros used to build final URI
 */
export const processFile = async (filename, delimiter) => {
    const records = [];
    const parser = fs.createReadStream(path.join(process.cwd(), filename)).pipe(
        parse({
            delimiter: delimiter || ',',
            skip_records_with_empty_values: true,
            skip_records_with_error: true
        })
    );
    for await (const record of parser) {
        records.push(record)
    }
    return records; //Edge case
}