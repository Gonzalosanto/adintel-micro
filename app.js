import {PORT,} from "./config/index.js";
import express from 'express';
const app = express();
import XML from 'xml-js';
import {} from './src/services/index.js'
import { save } from "./src/DAOs/fs/index.js";

const macros = {
    width : 1920,
    height : 1080,
    cb :  0,
    ua : '',
    uip: 0,
    app_name:"roku.univisionnow",
    app_bundle:"com.roku.univision",
    device_model:'',
    device_make:'',
    device_category:'',
    app_store_url:'https%3A%2F%2Fchannelstore.roku.com%2Fen-gb%2Fdetails%2F122460%2Funivision-now',
    device_id:0,
    vast_version:2,
}


const templateToTest = 
    `http://s.adtelligent.com/?width=${macros.width}&height=${macros.height}&cb=${macros.cb}&ua=${macros.ua}&uip=${macros.uip}&app_name=${macros.app_name}&app_bundle=${macros.app_bundle}&device_model=${macros.device_model}&device_make=${macros.device_make}&device_category=${macros.device_category}&app_store_url=${macros.app_store_url}&device_id=${macros.device_id}&vast_version=${macros.vast_version}&aid=833181`

const fetchResponse = async (url) => {
    console.log(`Requesting to: ${url} to get any response from adserver: ${ "Undefined" }`)
    fetch(url)
    .then(res => res.text())
    .then(res => {
            // let bodyToJSON = XML.xml2json(res, {compact: true});
            save(res);
        })
    .catch(e => {throw new Error(e)})
}

app.listen(PORT, ()=>{
    fetchResponse(templateToTest);
})