// import { getRequest } from "../../controllers/requests.controller";
// import { templateURL } from '../../config/index.js';
import { getRequest } from "../../controllers/requests.controller.js";
import { getURLsWithMacros } from "../../utils/csv.js";

const start = async (req,res, next) => {
    try {
        const data = await getURLsWithMacros("",'','')
        for (let n=0; n<data.length; n++){
            await getRequest(req,res,data[n])
        }
        console.log('Finished requesting...')
    } catch (error) {
        console.error(error)
    }


    //getRequest(req,res, templateURL)
}
const abort = (req,res, next) => {
    console.warn("Killing process...")
    process.exit();
}

export { start, abort }