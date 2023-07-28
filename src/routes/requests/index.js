import { runRequestsConcurrently } from "../../controllers/concurrency.js";
import { getURLsWithMacros } from "../../utils/csv.js";
import 'dotenv'

const start = async (req,res, next) => {
    const { hours, instances } = req.query
    console.log('Number of concurrent promises '+ instances + ' for ' + hours + ' hours.')
    const data = await getURLsWithMacros("",'',process.env.BUNDLE_LIST, process.env.DELIMITER) //this info must be get by req.body or req.params
    runRequestsConcurrently(data, instances, hours);
}

const abort = (req,res, next) => {
    console.warn("Killing process...")
    process.exit();
}

export { start, abort }