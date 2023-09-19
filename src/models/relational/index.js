import { AppBundle } from "./ApplicationBundle.model.js";
import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import { DeviceId } from "./DeviceID.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserAgent } from "./UserAgent.model.js";
import { UserIP } from "./UserIP.model.js";
import { StoreNames } from "./StoreName.model.js";
import { StoreNameBundles } from "./StoreNameBundle.model.js";

// Relationship between OS and AppStore
export const OS_has_Stores = OperativeSystem.hasMany(AppStore, {
});
export const Store_belongsTo_OS = AppStore.belongsTo(OperativeSystem, {
  target_key: "id",
});
// Relationship between AppStore, AppName and StoreNames (N:M relationship)
export const Store_belongsTo_Names = AppStore.belongsToMany(AppName, { through: StoreNames });
export const Name_belongsTo_Stores = AppName.belongsToMany(AppStore, {through: StoreNames})
StoreNames.belongsTo(AppStore);
StoreNames.belongsTo(AppName);
export const Store_has_StoreNames = AppStore.hasMany(StoreNames);
export const Name_has_StoreNames = AppName.hasMany(StoreNames);

//Relationship between AppBundle and StoreNames (N:M relationship)
export const Bundle_belongsTo_StoreNames = AppBundle.belongsToMany(StoreNames, { through: StoreNameBundles});
export const StoreName_belongsTo_Bundles = StoreNames.belongsToMany(AppBundle, {through: StoreNameBundles});
StoreNameBundles.belongsTo(AppBundle);
StoreNameBundles.belongsTo(StoreNames);
AppBundle.hasMany(StoreNameBundles);
StoreNames.hasMany(StoreNameBundles);

// Relationship between OS and UA
export const OS_has_UAs = OperativeSystem.hasMany(UserAgent, {});
export const UA_belongsTo_OS = UserAgent.belongsTo(OperativeSystem, {
  target_key: "id",
});
// Relationship between UA and UIP
export const UA_has_UIPs = UserAgent.hasMany(UserIP, {});
export const UIP_belongsTo_UA = UserIP.belongsTo(UserAgent, {
  target_key: "uip",
});
// Relationship between UA and DeviceId
export const UA_has_DeviceIDs = UserAgent.hasMany(DeviceId, {});
export const DeviceID_belongsTo_UA = DeviceId.belongsTo(UserAgent, {
  target_key: "deviceid",
});
export {
  AppName,
  AppBundle,
  AppStore,
  DeviceId,
  OperativeSystem,
  UserAgent,
  UserIP,
  StoreNames,
  StoreNameBundles
};
