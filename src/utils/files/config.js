const VAST_VERSION = {
    '2' : '2.0',
    '4' : '4.2'
}

const DIMENSIONS = {
    '16:9':{
        FHD : {width: 1920, height: 1080},
        HD : {width: 1280, height: 720}
    }
}

const CATEGORY = {
    MOBILE: 1,
    DESKTOP: 2,
    WEB: 3,
    CTV : 4
}

const macros = {
    width : DIMENSIONS["16:9"].FHD.width,
    height : DIMENSIONS["16:9"].FHD.height,
    cb :  '', //Se puede completar con el primer response
    ua : '', //user agent 
    uip: '', //Como setear este param? Investigar...
    app_name:'',
    app_bundle:'',
    device_model:'', //No provisto
    device_make:'', //Inferir del store o UA provisto
    device_category: CATEGORY.CTV,
    app_store_url:'',
    device_id:'', //parametro que apunta a dispositivo unico. NO SETEARLO
    vast_version: VAST_VERSION[4],
}

const OS = {
    key : 'value'
}

export {macros, OS}