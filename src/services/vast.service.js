import { db_client } from '../db/mariadb.js'
import {AppName, AppBundle, AppStore, OperativeSystem, DeviceId, UserAgent, UserIP } from '../models/relational/index.js'


export const BulkInsertAppNames = async (values)=>{ return  AppName.bulkCreate(values)};

export const BulkInsertAppBundle = async (values)=>{ return  AppBundle.bulkCreate(values)};

export const BulkInsertAppStore = async (values)=>{ return  AppStore.bulkCreate(values)};

export const BulkInsertOS = async (values)=>{ return  OperativeSystem.bulkCreate(values)};

export const BulkInsertDeviceID = async (values)=>{ return  DeviceId.bulkCreate(values)};

export const BulkInsertUserAgent = async (values)=>{ return  UserAgent.bulkCreate(values)};

export const BulkInsertUserIP = async (values)=>{ return  UserIP.bulkCreate(values)};

export const BulkInsertData = async () => { 
    //TODO: This function should insert data according to associations defined in models.
    
}

export const SelectAll = async (attributes, model) => {
    if(attributes) return model.findAll(attributes)
    return model.findAll()
};

