import { DataTypes } from "sequelize";
import { db_client } from '../../db/mariadb.js';

export const AppStore = db_client.define('AppStore', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    store: {type: DataTypes.STRING, allowNull: false }
});

