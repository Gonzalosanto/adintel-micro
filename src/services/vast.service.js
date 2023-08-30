import { db_client } from '../db/mariadb.js'
import {AppName, AppBundle, AppStore, OperativeSystem, DeviceId, UserAgent, UserIP } from '../models/relational/index.js'


export const BulkInsertAppNames = async (values)=>{
    values = filterRepeatedValues(values, AppName) 
    return  AppName.bulkCreate(values)};

export const BulkInsertAppBundle = async (values)=>{
    values = filterRepeatedValues(values, AppBundle) 
    return  AppBundle.bulkCreate(values)};

export const BulkInsertAppStore = async (values)=>{
    values = filterRepeatedValues(values, AppStore) 
    return  AppStore.bulkCreate(values)};

export const BulkInsertOS = async (values)=>{
    values = filterRepeatedValues(values, OperativeSystem) 
    return  OperativeSystem.bulkCreate(values)};

export const BulkInsertDeviceID = async (values)=>{
    values = filterRepeatedValues(values, DeviceId) 
    return  DeviceId.bulkCreate(values)};

export const BulkInsertUserAgent = async (values)=>{
    values = filterRepeatedValues(values, UserAgent) 
    return  UserAgent.bulkCreate(values)};

export const BulkInsertUserIP = async (values)=>{
    values = filterRepeatedValues(values, 'uip', UserIP)
    return UserIP.bulkCreate(values)
};
const filterRepeatedValues = async (values, key, model) => {
    const existingValues = await SelectAll(null, model);
    const existingValuesSet = new Set(existingValues.map(value => value[key]));
    return values.filter(value => {!existingValuesSet.has(value[key])});
}
export const SelectAll = async (attributes, model) => {
    if(attributes) return model.findAll(attributes)
    return model.findAll()
};