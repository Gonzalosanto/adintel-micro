import { Router } from "express";
import { getRequest } from "../controllers/requests.controller.js";
import { templateURL } from '../../config/index.js';
import { abort, start } from "./requests/index.js";

export const router = Router();

router.get('/start', (req,res, next) => {
    start(req,res, next);
    res.send("Process has been launched...");
});
router.get('/abort', (req,res, next) => {
    res.status(200).send("Killing process...")
    abort(req,res,next)
})
router.get('/', (req,res, next)=> {res.send("Listening...") })

// const get = async (req,res) => { //launch process
//     getRequest(req,res, templateURL)
// }