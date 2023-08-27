import { Sequelize } from "sequelize";
const db_name = 'VAST_DB'

export const client = new Sequelize(`mariadb://localhost:/${db_name}`)
