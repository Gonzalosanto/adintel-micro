import { Router } from "express";
import path from 'path'
import { abort, start } from "./requests/index.js";
import { getURLsWithMacros, processFile } from "../utils/csv.js";
import { getUsageStats } from "../utils/usage.js";

export const router = Router();

router.get('/start', async(req,res, next) => {
    try {
        start(req,res, next);
        res.status(200).send("Process has been launched...");
    } catch (error) {
        res.status(500)
    }
});

router.get('/stats', (req,res,next) => getUsageStats(req,res,next));

router.get('/test', async (req,res, next) => {
    try {
        const test = async () => {
            return getURLsWithMacros('', '', './docs/bigList.csv', ';');
        }
        res.status(200).send(await test());
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/parse', async (req,res,next)=>{
    try {
        const content = await processFile('./docs/newCSV.csv', ',')
        res.send(content);
    } catch (error) {
        console.error(error)
        res.send("Error while parsing file...")
    }
})
router.get('/abort', async(req,res, next) => {
    res.status(200).send("Killing process...")
    abort(req,res,next)
})
router.get('/', async (req,res, next)=> {
    try {
        console.log("Reading file..." + path.join(process.cwd(), './public/index.xml'))
        const result = await readXML(path.join(process.cwd(), './public/index.xml'))
        if(result) res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Cracked!')
    }
})
