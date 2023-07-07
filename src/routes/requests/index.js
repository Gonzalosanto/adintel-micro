import { runRequestsConcurrently } from "../../controllers/concurrency.js";
import { getURLsWithMacros } from "../../utils/csv.js";

const start = async (req,res, next) => {
    getURLsWithMacros("",'','').then((data)=>{
        runRequestsConcurrently(data,200);
    })
    .catch(e => {
        error(e);
        res.status(500);
    })
}
const abort = (req,res, next) => {
    console.warn("Killing process...")
    process.exit();
}

export { start, abort }