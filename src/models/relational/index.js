import { AppBundle } from "./ApplicationBundle.model.js";
import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import { DeviceId } from "./DeviceID.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserAgent } from "./UserAgent.model.js";
import { UserIP } from "./UserIP.model.js";

//TODO: add every model and associations.
AppBundle.hasOne(AppName, {
  foreignkey: "name",
});
AppName.hasOne(AppStore, {
  foreignkey: "store",
});
AppName.belongsTo(AppBundle, {
  foreignkey: "bundle",
  target_key: "name",
});

AppStore.hasOne(OperativeSystem, {
  foreignkey: "os",
});
AppStore.belongsTo(AppName, {
  foreignkey: "name",
  target_key: "store",
});
DeviceId.belongsTo(UserAgent, {
  foreignkey: "ua",
  target_key: "deviceid",
});
OperativeSystem.hasMany(UserAgent, {
  foreignkey: "ua",
});
OperativeSystem.belongsTo(AppStore, {
  foreignkey: "appname",
  target_key: "os",
});
UserAgent.hasMany(UserIP, {
  foreignkey: "uip",
});

UserAgent.hasMany(DeviceId, {
  foreignkey: "deviceid",
});

UserAgent.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "ua",
});
UserIP.belongsTo(UserAgent, {
  foreignkey: "ua",
  target_key: "uip",
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
