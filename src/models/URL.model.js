import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const URLSchema = new Schema({
    baseUrl: {type: String, required: [true, "There is no Valid Resource. Please check your input!"]},
    width: String,
    height: String,
    device_id:String,
    device_make:String,
    device_category:String,
    uip: String,
    cb: String,
    ua: String,
    app_name:String,
    app_bundle:String,
    app_store_url:String,
    device_id:String,
    vast_version:String
})

export const URL = mongoose.model("URL", URLSchema);