import { AppBundle } from "./ApplicationBundle.model.js";
import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import { DeviceId } from "./DeviceID.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserAgent } from "./UserAgent.model.js";
import { UserIP } from "./UserIP.model.js";

// Relationship between OS and AppStore
export const OS_has_Stores= OperativeSystem.hasMany(AppStore, {
  foreignkey: "id",
});
export const Store_belongsTo_OS = AppStore.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
});
// Relationship between AppStore and AppName
export const Store_has_Names =AppStore.hasMany(AppName, {
  foreignkey: "id",
});
export const Name_belongsTo_Store =AppName.belongsTo(AppStore, {
  foreignkey: "id",
  target_key: "id",
});
// Relationship between AppStore and AppName
export const Name_has_Bundle = AppName.hasOne(AppBundle, {
  foreignkey: "id",
});
export const Bundle_belongsTo_Name = AppBundle.belongsTo(AppName, {
  foreignkey: "id",
  target_key: "id",
});
// Relationship between OS and UA
export const OS_has_UAs = OperativeSystem.hasMany(UserAgent, {
  foreignkey: "id",
});
export const UA_belongsTo_OS = UserAgent.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
});
// Relationship between UA and UIP
export const UA_has_UIPs = UserAgent.hasMany(UserIP, {
  foreignkey: "uip",
});
export const UIP_belongsTo_UA = UserIP.belongsTo(UserAgent, {
  foreignkey: "ua",
  target_key: "uip",
});
// Relationship between UA and DeviceId
export const UA_has_DeviceIDs = UserAgent.hasMany(DeviceId, {
  foreignkey: "deviceid",
});
export const DeviceID_belongsTo_UA = DeviceId.belongsTo(UserAgent, {
  foreignkey: "ua",
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
};
