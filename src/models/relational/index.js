import { AppBundle } from "./ApplicationBundle.model.js";
import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import { DeviceId } from "./DeviceID.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserAgent } from "./UserAgent.model.js";
import { UserIP } from "./UserIP.model.js";

// Relationship between OS and AppStore
OperativeSystem.hasMany(AppStore, {
  foreignkey: "id",
});
AppStore.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
});
// Relationship between AppStore and AppName
AppStore.hasOne(AppName, {
  foreignkey: "id",
});
AppName.belongsTo(AppStore, {
  foreignkey: "id",
  target_key: "id",
});
// Relationship between AppStore and AppName
AppName.hasOne(AppBundle, {
  foreignkey: "id",
});
AppBundle.belongsTo(AppName, {
  foreignkey: "id",
  target_key: "id",
});
// Relationship between OS and UA
OperativeSystem.hasMany(UserAgent, {
  foreignkey: "id",
});
UserAgent.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
});
// Relationship between UA and UIP
UserAgent.hasMany(UserIP, {
  foreignkey: "uip",
});
UserIP.belongsTo(UserAgent, {
  foreignkey: "ua",
  target_key: "uip",
});
// Relationship between UA and DeviceId
UserAgent.hasMany(DeviceId, {
  foreignkey: "deviceid",
});
DeviceId.belongsTo(UserAgent, {
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
