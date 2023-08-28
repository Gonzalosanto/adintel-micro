import { DataTypes } from "sequelize";
import { db } from './index.js'
import { AppName } from "./ApplicationName.model.js";
import { OperativeSystem } from "./OperativeSystem.model.js";

export const AppStore = db.define('AppStore', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    store: {type: DataTypes.STRING, allowNull: false }
});

AppStore.hasOne(OperativeSystem,{
    foreignkey: 'os'
});
AppStore.belongsTo(AppName,{
    foreignkey: 'name',
    target_key: 'store'
});

(async () => {
    client.sync({force: true})
})();