import { DataTypes } from "sequelize";
import { AppBundle } from './ApplicationBundle.model.js';
import { AppStore } from './ApplicationStore.model.js';
import { db } from './index.js'

export const AppName = db.define('AppName', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false }
});

AppName.hasOne(AppStore,{
    foreignkey: 'store'
});
AppName.belongsTo(AppBundle,{
    foreignkey: 'bundle',
    target_key: 'name'
});

(async () => {
    client.sync({force: true})
})();