import os from 'os'
import { debug, info, error, warning } from '../middlewares/logger/index.js'

const stats = {
    Parallelism : os.availableParallelism,
    CPU : {
        cpus: os.cpus,
        FreeMem : os.freemem,
        TotalMem: os.totalmem,
    }
}

export const getUsageStats = (req,res,next) => {
    info(JSON.stringify(stats))
    res.status(200).send(JSON.stringify(stats))
}