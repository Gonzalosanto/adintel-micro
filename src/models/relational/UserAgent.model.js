import { DataTypes } from "sequelize";
import { db } from './index.js'
import { OperativeSystem } from "./OperativeSystem.model.js";
import { UserIP } from "./UserIP.model.js";
import { DeviceId } from "./DeviceID.model.js";

export const UserAgent = db.define('UserAgent', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    ua: {type: DataTypes.STRING, allowNull: false }
});

UserAgent.hasMany(UserIP,{
    foreignkey: 'uip'
});

UserAgent.hasMany(DeviceId,{
    foreignkey: 'deviceid'
});

UserAgent.belongsTo(OperativeSystem,{
    foreignkey: 'os',
    target_key: 'ua'
});

(async () => {
    client.sync({force: true})
})();