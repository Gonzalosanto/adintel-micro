import { extractDataFrom } from "../../utils/http.js" 
import fs from 'fs/promises'

/**
 * 
 * @param {path} filename Path of XML file to read 
 */
export const readXML = async (filename) => {
    const d = await fs.readFile(filename);
    return extractDataFrom(d, {impressions:[],events:[]})
}