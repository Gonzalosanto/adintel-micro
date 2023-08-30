import {} from '../../services/vast.service.js';
import { processFile } from '../../utils/files/fileProcessor.js';
export const saveDataToDB = async(path)=>{
    await processFile(path,';');
};