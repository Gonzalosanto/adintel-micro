import { triggerImpressions } from "../../utils/http.js" 
import fs from 'fs'

/**
 * 
 * @param {path} filename Path of XML file to read 
 */
export const readXML = (filename) => {
    fs.readFile(filename, (e, d)=>{
        if(e) throw e;
        if(typeof d == String) triggerImpressions(d)
    })
}