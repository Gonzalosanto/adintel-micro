import { Router } from "express";
import path from 'path'
import { abort, start } from "./requests/index.js";
import { saveFileData } from "./requests/file.js";

export const router = Router();

router.get('/start', async(req,res, next) => {
    try {
        start(req,res, next);
        res.status(200).send("Process has been launched...");
    } catch (error) {
        res.status(500)
    }
});

router.get('/abort', async(req,res, next) => {
    res.status(200).send("Killing process...")
    abort(req,res,next)
})
router.get('/file', async (req,res, next)=> {
    try {
        saveFileData()
        res.status(200).send("Your request has been fulfilled")
    } catch (error) {
        res.status(500).send(error)
    }
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
