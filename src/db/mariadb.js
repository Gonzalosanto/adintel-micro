import { Sequelize } from "sequelize";

export const client = new Sequelize(`${process.env.db_name || 'vast'}`, `${process.env.db_username || 'root'}`, `${process.env.db_password || 'root'}`, {
    host: process.env.db_hostname || 'localhost',
    dialect: process.env.db_dialect || 'mariadb'
})

const connectionEstablished = () => {client.authenticate().then(()=>{return 'Connection established'}).catch(()=>{return false})}

export const connectMariaDBClient = async ()  => {
    try {
        await client.authenticate()
    } catch (error) {
        console.log('Connection error: ' + error)
    }
}