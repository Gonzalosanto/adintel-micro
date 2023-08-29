import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js';

export const UserAgent = db_client.define('UserAgent', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    ua: {type: DataTypes.STRING, allowNull: false }
});

