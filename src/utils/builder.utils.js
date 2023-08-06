import {GetMacros} from '../services/macros.service.js';
import {BASE_URL, DEVICE_CATEGORY, VAST_VERSION, } from '../../config/index.js';
const urlBuilder = (macros, id) => {return `${BASE_URL}/?width=${macros.width}&height=${macros.height}&cb=&ua=${macros.ua}&uip=${macros.uip}&app_name=${macros.app_name}&app_bundle=${macros.app_bundle}&device_model=&device_make=&device_category=${DEVICE_CATEGORY}&app_store_url=${encodeURIComponent(macros.app_store_url)}&device_id=${macros.device_id || ''}&vast_version=${VAST_VERSION}&aid=${id}`;}
const getDataToBuild = async (skip, limit) => {return GetMacros(skip, limit)}

const processURLsToRequest = async (data) => {
    let urls = []
    for (let i = 0; i < data.length; i++) {
        urls.push(urlBuilder(data[i], process.env.AID))
    }
    return urls
}
export const urlsToRequest = async (skip, limit) => {
    const dataToBuild = await getDataToBuild(skip, limit)
    const urls = await processURLsToRequest(dataToBuild)
    return urls
}