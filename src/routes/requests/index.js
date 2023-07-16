import { runRequestsConcurrently } from "../../controllers/concurrency.js";
import { getURLsWithMacros } from "../../utils/csv.js";

const start = async (req,res, next) => {
    const data = await getURLsWithMacros("",'','./docs/newCSV.csv')
    runRequestsConcurrently(data,500);
}

const abort = (req,res, next) => {
    console.warn("Killing process...")
    process.exit();
}

// const test = async (req,res, next) => {
//     getURLsWithMacros("",'','./docs/csv.txt').then((data)=>{
//         runRequestsConcurrently(data,3);
//     })
//     .catch(e => {
//         error(e);
//         res.status(500);
//     })
// }

export { start, abort }