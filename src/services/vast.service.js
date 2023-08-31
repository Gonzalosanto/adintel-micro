// import { db_client } from '../db/mariadb.js'
import {AppName, AppBundle, AppStore, OperativeSystem, DeviceId, UserAgent, UserIP } from '../models/relational/index.js'

export const BulkInsertAppNames = async (values)=>{
    values = await filterRepeatedValues(values,'name', AppName) 
    console.log(values);
    return  AppName.bulkCreate(values)};

export const BulkInsertAppBundle = async (values)=>{
    values = await filterRepeatedValues(values,'bundle', AppBundle) 
    return  AppBundle.bulkCreate(values)};

export const BulkInsertAppStore = async (values)=>{
    values = await filterRepeatedValues(values,'store', AppStore) 
    return  AppStore.bulkCreate(values)};

export const BulkInsertOS = async (values)=>{
    values = await filterRepeatedValues(values,'os', OperativeSystem) 
    return  OperativeSystem.bulkCreate(values)};

export const BulkInsertDeviceID = async (values)=>{
    values = await filterRepeatedValues(values,'deviceid', DeviceId) 
    return  DeviceId.bulkCreate(values)};

export const BulkInsertUserAgent = async (values)=>{
    values = await filterRepeatedValues(values,'ua', UserAgent) 
    return  UserAgent.bulkCreate(values)};

export const BulkInsertUserIP = async (values)=>{
    values = await filterRepeatedValues(values, 'uip', UserIP)
    return UserIP.bulkCreate(values)
};
const filterRepeatedValues = async (values, key, model) => {
    const existingValues = await SelectAll(null, model);
    if(existingValues.length == 0) return values;
    const existingValuesSet = new Set(existingValues.map(value => value[key]));
    return values.filter(value => {!existingValuesSet.has(value[key])});
}
export const SelectAll = async (attributes, model) => {
    if(attributes) return model.findAll(attributes)
    return model.findAll()
};