import { AppBundle } from "./ApplicationBundle.model.js";
import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import { DeviceId } from "./DeviceID.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserAgent } from "./UserAgent.model.js";
import { UserIP } from "./UserIP.model.js";

OperativeSystem.hasMany(AppStore, {
  foreignkey: "id",
});
AppStore.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
});
AppStore.hasOne(AppName, {
  foreignkey: "id",
});
AppName.belongsTo(AppStore, {
  foreignkey: "id",
  target_key: "id",
});
AppName.hasOne(AppBundle, {
  foreignkey: "id",
});
AppBundle.belongsTo(AppName, {
  foreignkey: "id",
  target_key: "id",
});
DeviceId.belongsTo(UserAgent, {
  foreignkey: "ua",
  target_key: "deviceid",
});
OperativeSystem.hasMany(UserAgent, {
  foreignkey: "id",
});

UserAgent.hasMany(UserIP, {
  foreignkey: "uip",
});

UserAgent.hasMany(DeviceId, {
  foreignkey: "deviceid",
});

UserAgent.belongsTo(OperativeSystem, {
  foreignkey: "os",
  target_key: "id",
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
