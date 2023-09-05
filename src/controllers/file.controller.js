import {} from '../services/vast.service.js';
import { processFile } from '../utils/files/fileProcessor.js';
import { saveBundles } from '../services/vast.service.js';
export const saveFileData = () => {
    return processFile(process.env.BUNDLE_LIST, process.env.DELIMITER)
}
export const saveDataToDB = async(path)=>{
    const records = await processFile(path,';');
    saveRecords(records);
};
const saveRecords = async (rows) => {
    try {
        let data = {
            bundles:[],
            stores:[],
            names:[],
            os: []
        }
        rows.map(async (row)=>{
            os.push(row[3])
            stores.push({store: row[2], os: row[3]})
            names.push({name: row[1], store: row[2]})
            bundles.push({bundle: row[0], name:row[1]})
        })
        saveBundles(data)
    } catch (error) {
        console.log(error)
    }
}