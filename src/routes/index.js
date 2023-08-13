import { Router } from "express";
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