import { Router } from "express";
import { abort, start } from "./requests/index.js";
import { saveDataToDB, saveFileData } from "../controllers/file.controller.js";
import { saveBundles, saveDeviceData } from "../services/vast.service.js";

export const router = Router();

router.get('/start', async(req,res, next) => {
    try {
        start(req,res, next);
        res.status(200).send("Process has been launched...");
    } catch (error) {
        res.status(500);
    }
});
router.get('/abort', async(req,res, next) => {
    res.status(200).send("Killing process...")
    abort(req,res,next);
})
router.get('/file', async (req,res, next)=> {
    try {
        saveFileData()
        res.status(200).send("Your request has been fulfilled")
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/save', async (req, res)=>{
    try {
        await saveDataToDB('/docs/newBundles.csv', saveBundles);
        res.send('Data saved successfully')
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/saveDeviceData', async (req, res)=>{
    try {
        await saveDataToDB('/docs/roku1.csv', saveDeviceData);
        res.send('Data saved successfully')
    } catch (err) {
        res.status(500).send(err);
    }
})