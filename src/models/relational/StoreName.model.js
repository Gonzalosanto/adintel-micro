import { AppName } from "./ApplicationName.model.js";
import { AppStore } from "./ApplicationStore.model.js";
import {db_client} from "../../db/mariadb.js"
import { DataTypes } from "sequelize";

export const StoreNames = db_client.define('StoreNames', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    AppNameId: {
      type: DataTypes.INTEGER,
      references: {
        model: AppName,
        key: 'id'
      }
    },
    AppStoreId: {
      type: DataTypes.INTEGER,
      references: {
        model: AppStore,
        key: 'id'
      }
    }
  });