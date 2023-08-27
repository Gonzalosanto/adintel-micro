import { DataTypes } from "sequelize";
import { ApplicationName } from './ApplicationName.model.js';
import { client } from './index.js'

export const ApplicationBundle = client.define('ApplicationBundle', {
    id: {type: DataTypes.NUMBER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true},
    bundle: {type: DataTypes.STRING, allowNull: false }
}, {})

ApplicationBundle.hasOne(ApplicationName, {allowNull: false});
ApplicationName.belongsTo(ApplicationBundle)

(async () => {
    client.sync({force: true})
})();