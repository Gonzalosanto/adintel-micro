import { DataTypes } from "sequelize";
import { client } from '../../db/mariadb.js'

export const AppBundle = client.define('AppBundle', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    bundle: {type: DataTypes.STRING, allowNull: false }
});
