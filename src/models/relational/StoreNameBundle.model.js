import { DataTypes } from 'sequelize'
import {db_client} from '../../db/mariadb.js'

export const StoreNameBundles = db_client.define('storenamesbundles',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }
})