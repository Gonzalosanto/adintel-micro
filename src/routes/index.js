import { Router } from "express";
import { getRequest } from "../controllers/requests.controller.js";
import path from 'path'
import { abort, start } from "./requests/index.js";
import { readXML } from "./requests/reader.js";

export const router = Router();

router.get('/start', (req,res, next) => {
    start(req,res, next);
    res.status(200).send("Process has been launched...");
});
router.get('/abort', (req,res, next) => {
    res.status(200).send("Killing process...")
    abort(req,res,next)
})
router.get('/', (req,res, next)=> {
    readXML(path.join(process.cwd(), './public/index.xml'))
    // res.status(200).send(result)
})
