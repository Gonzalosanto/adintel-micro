import { runRequestsConcurrently } from "../../controllers/concurrency.js";
import 'dotenv'

const start = async (req,res, next) => {
    const { hours, instances } = req?.query || {hours : 1, instances: 100}
    console.log('Number of concurrent promises '+ instances + ' for ' + hours + ' hours.')
    runRequestsConcurrently(instances, hours);
}

const abort = (req,res, next) => {
    console.warn("Killing process...")
    process.exit();
}

export { start, abort }