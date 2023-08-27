import { DataTypes } from "sequelize";
import { ApplicationName } from './ApplicationName.model.js';
import { client } from './index.js'
import { ApplicationBundle } from "./ApplicationBundle.model.js";

export const ApplicationName = client.define('ApplicationName', {
    id: {type: DataTypes.NUMBER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true},
    application_name: {type: DataTypes.STRING, allowNull: false }
}, {})

(async () => {
    client.sync({force: true})
})();