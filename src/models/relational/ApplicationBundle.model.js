import { DataTypes } from "sequelize";
import { AppName } from './ApplicationName.model.js';

export const AppBundle = db.define('AppBundle', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    bundle: {type: DataTypes.STRING, allowNull: false }
});

AppBundle.hasOne(AppName,{
    foreignkey: 'name'
});