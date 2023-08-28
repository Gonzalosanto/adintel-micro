import { DataTypes } from "sequelize";
import { UserAgent } from "./UserAgent.model.js";

export const UserIP = db.define('UserIP', {
    id: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    uip: {type: DataTypes.STRING, allowNull: false }
});

UserIP.belongsTo(UserAgent,{
    foreignkey: 'ua',
    target_key: 'uip'
});