const PORT = 8080;
const macros = {
    width : 1920,
    height : 1080,
    cb :  '',
    ua : 'Mozilla/5.0 (SMART-TV; Linux; Tizen 4.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/56.0.2924.0 TV Safari/537.36 [ip:88.4.38.124]',
    uip: '88.4.38.124',
    app_name:"Telemundo",
    app_bundle:"com.nbcuni.telemundo.noticiastelemundo",
    device_model:'',
    device_make:'Tizen',
    device_category:4,
    app_store_url:'https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fhl%3Den',
    device_id:'',
    vast_version:'2.0',
}

// Params obligatorios:  bundle, app-name, store-url
// Params rotativo : UIP y UA
// Fijos: Width Height - Device-Category, Vast-Version:2.0,
// com.nbcuni.telemundo.noticiastelemundo
// app name: EstrellaTV
// store: https%3A%2F%2Fchannelstore.roku.com%2Fen-gb%2Fdetails%2F262b4e3dfed18c6436ba86234af769a7%2Festrellatv-tv-en-espanol

const templateURL = encodeURI(`http://s.adtelligent.com/?width=${macros.width}&height=${macros.height}&cb=${macros.cb}&ua=${macros.ua}&uip=${macros.uip}&app_name=${macros.app_name}&app_bundle=${macros.app_bundle}&device_model=${macros.device_model}&device_make=${macros.device_make}&device_category=${macros.device_category}&app_store_url=${macros.app_store_url}&device_id=${macros.device_id}&vast_version=${macros.vast_version}&aid=833181`
)
export { PORT, templateURL };