import { DataTypes } from "sequelize";
import { db_client } from "../../db/mariadb.js";

export const DeviceId = db_client.define("DeviceId", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  deviceid: { type: DataTypes.STRING, allowNull: false },
});


