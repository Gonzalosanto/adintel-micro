import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js'

export const AppBundle = db_client.define('AppBundle', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    bundle: {type: DataTypes.STRING, allowNull: false }
});