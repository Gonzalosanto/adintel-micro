import { Sequelize } from "sequelize";

export const db_client = new Sequelize(`${process.env.db_name || 'vast'}`, `${process.env.db_username || 'root'}`, `${process.env.db_password || 'root'}`, 
{
    host: process.env.db_hostname || 'localhost',
    dialect: process.env.db_dialect || 'mariadb',
    logging: false,
}
)

const connectionEstablished = () => {db_client.authenticate().then(()=>{return 'Connection established'}).catch(()=>{return false})}

export const connectMariaDBClient = async ()  => {
    try {
        await db_client.authenticate()
    } catch (error) {
        console.log('Connection error: ' + error)
    }
}