import { warning } from "../middlewares/logger/index.js";
import { getURLsWithMacros } from "../utils/csv.js";
import { getRequest } from "./requests.controller.js";

const MINUTE = 60 * 1000;
const HOURS = (3*60);
// export const start = async (req,res, next) => {
//     try {
        
//         let startTime = Date.now();
//         let n = 0;
//         const data = await getURLsWithMacros("",'','')
//         while((Date.now() - startTime) < (hours * MINUTE)){
//             if(n==data.length) n = 0;
//             await getRequest(req,res,data[n]);
//             n++;
//         }
//         console.log('Finished requesting...')
//     } catch (error) {
//         throw new Error(`Fatal Error: ${error}`)
//     }
// }

export const runRequestsConcurrently = async (urls, concurrency) => {
    let startTime = Date.now();
    const promises = [];
  //Bucle determinado por tiempo...
    while ((Date.now() - startTime) < (HOURS * MINUTE)) {
        let index = 0;
        // Ejecutar las solicitudes de forma concurrente hasta alcanzar el límite de concurrencia
        while (promises.length < concurrency && urls.length > 0) {
            if(index == urls.length) index = 0;
            const url = urls[index];
            promises.push(getRequest(null, null, url));
            index++;
        }
        warning("todas las urls han sido recorridas")
        await Promise.all(promises);
        // Limpiar las promesas resueltas
        promises.length = 0;
        }
  
    console.log('Todas las solicitudes se han completado dentro del tiempo especificado.');
}
