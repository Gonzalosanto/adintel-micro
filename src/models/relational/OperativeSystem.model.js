import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js';

export const OperativeSystem = db_client.define('OperativeSystem', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    os: {type: DataTypes.STRING, allowNull: false }
});