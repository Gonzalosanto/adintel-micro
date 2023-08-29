import { DataTypes } from "sequelize";
import { UserAgent } from "./UserAgent.model.js";

export const DeviceId = db.define('DeviceId', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    deviceid: {type: DataTypes.STRING, allowNull: false }
});

DeviceId.belongsTo(UserAgent,{
    foreignkey: 'ua',
    target_key: 'deviceid'
});