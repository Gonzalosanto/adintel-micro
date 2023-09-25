import { db_client } from '../db/mariadb.js'
import { AppName, AppBundle, AppStore, OperativeSystem, DeviceId, UserAgent, UserIP, StoreNames, StoreNameBundles } from '../models/relational/index.js'

async function BulkInsertDistinct(model, columnName, values){
    values = await filterRepeatedValues(values, columnName, model)
    return model.bulkCreate(values)
};

const filterRepeatedValues = async (values, key, model) => {
    let existingValues = await SelectAll(model, null);
    if(existingValues.length == 0) return values;
    existingValues = existingValues.map(value => value.dataValues[key])
    return values.filter(value => !existingValues.includes(value[key]))
};

export const SelectAll = async (model, attributes) => {
    if(attributes) return model.findAll(attributes)
    return model.findAll()
};

const insertDataToTable = async (model, data, modelKeys) => {
    modelKeys.map( async modelKey => {
        data = data.map(d => d[modelKey])
        const values = [...new Set(data)]
        await BulkInsertDistinct(model, modelKey, values.map(v => {return {[modelKey] : v}}))
    })
};

export const saveBundles = async (data) => {
    const {os, bundles, stores, names} = data

    const setOperativeSystemToStores = async (storeInstances, operatingSystem) => {
        storeInstances.map(async (inst, index) => {
            const id = operatingSystem.filter(o => {
                if(stores[index]?.os == o.os) return o.id
            })
            await inst.setOperativeSystem(id[0])
        })
    }

    const setStoreNameRelationship = async (bundleList) => {
        //A: Asigna a cada storeName su par de claves foraneas de las tablas Name y Store
        for (let i = 0; i < bundleList.length; i++) {
            const n = await AppName.findOne({ where: { name: bundleList[i].name }});
            const s = await AppStore.findOne({where: { store: bundleList[i].store }});
            const sn = await StoreNames.findOne({ where: { AppStoreId: s.dataValues.id, AppNameId: n.dataValues.id } });
            if (!sn) { await n.addAppStore(s) }
        }
    }

    const setStoreNameBundleRelationship = async (bundleList) => {
        //A: Asigna a cada StoreNameBundle su par de claves foraneas de las tablas StoreNames y AppBundle
        for (let i = 0; i < bundleList.length; i++) {
            const n = await AppName.findOne({ where: { name: bundleList[i].name }});
            const s = await AppStore.findOne({ where: { store: bundleList[i].store } });
            const b = await AppBundle.findOne({where: {bundle : bundleList[i].bundle }})
            const sn = await StoreNames.findOne({where:{AppNameId: n.dataValues.id, AppStoreId: s.dataValues.id}})
            const snxb = await StoreNameBundles.findOne({where:{StoreNameId: sn?.dataValues?.id, AppBundleId: s?.dataValues?.id}})
            if (!snxb) {
                await sn.addAppBundle(b)
            }
        }
    }

    try {
        await insertDataToTable(OperativeSystem, os, ['os']);
        await insertDataToTable(AppStore, stores, ['store']);
        await insertDataToTable(AppName, names, ['name']);
        await insertDataToTable(AppBundle, bundles, ['bundle']);
        
        const osInstances = await SelectAll(OperativeSystem, null);
        const storeInstances = await SelectAll(AppStore, null);

        await setOperativeSystemToStores(storeInstances, osInstances)
        await setStoreNameRelationship(bundles);
        await setStoreNameBundleRelationship(bundles);
    } catch (e) {
        console.log(e);
    }
};

export const saveDeviceData = async (data) => {
    const {uas, uips, deviceids} = data
    // //DEVICE DATA FILE DOES NOT CONTAIN OS DATA...
    // const setOperatingSystemsToUAs = async (uaInstances ,operatingSystem) => {
    //     uaInstances.map(async (inst, index) => {
    //         const id = operatingSystem.filter(os => {
    //             if(uas[index].os == os.os) return os.id
    //         })
    //         await inst.setOperativeSystem(id[0])
    //     })
    // }

    try {
        await insertDataToTable(UserAgent, uas, ['ua']);
        await insertDataToTable(UserIP, uips, ['uip']);
        await insertDataToTable(DeviceId, deviceids, ['deviceid']);

        //  const osInstances = await SelectAll(OperativeSystem, null);
        //  const uaInstances = await SelectAll(UserAgent, null);

        //await setOperatingSystemsToUAs(uaInstances, osInstances);

    } catch (error) {
        console.log(error)
    }
};