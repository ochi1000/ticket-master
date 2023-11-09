import { Sequelize } from "sequelize";
import 'dotenv/config'

const DB_NAME: string = process.env.DB_NAME || '';
const DB_URL: string = process.env.DB_URL || '';
const DB_USERNAME: string = process.env.DB_USERNAME || '';
const DB_PASSWORD: string = process.env.DB_PASSWORD || '';

const sequelize:Sequelize = new Sequelize(
   DB_NAME,
   DB_USERNAME,
   DB_PASSWORD,
    {
      host: DB_URL,
      dialect: 'mysql'
    }
  );


export {sequelize}