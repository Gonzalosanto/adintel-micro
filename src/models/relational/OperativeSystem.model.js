import { DataTypes } from "sequelize";
import { db } from './index.js'
import { AppStore } from "./ApplicationStore.model.js";
import { UserAgent } from "./UserAgent.model.js";

export const OperativeSystem = db.define('OperativeSystem', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    os: {type: DataTypes.STRING, allowNull: false }
});

OperativeSystem.hasMany(UserAgent,{
    foreignkey: 'ua'
});
OperativeSystem.belongsTo(AppStore,{
    foreignkey: 'appname',
    target_key: 'os'
});

(async () => {
    client.sync({force: true})
})();