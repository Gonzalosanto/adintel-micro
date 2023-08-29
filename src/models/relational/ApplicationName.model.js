import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js';

export const AppName = db_client.define('AppName', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false }
});