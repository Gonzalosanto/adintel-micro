import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js'

export const UserIP = db_client.define('UserIP', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    uip: {type: DataTypes.STRING, allowNull: false }
});

