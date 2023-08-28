import { DataTypes } from "sequelize";
import { db } from './index.js'
import { UserAgent } from "./UserAgent.model.js";

export const DeviceId = db.define('DeviceId', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    deviceid: {type: DataTypes.STRING, allowNull: false }
});

DeviceId.belongsTo(UserAgent,{
    foreignkey: 'ua',
    target_key: 'deviceid'
});

(async () => {
    client.sync({force: true})
})();