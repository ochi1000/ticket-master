import { Sequelize } from "sequelize";
import 'dotenv/config'

const DB_NAME: string = process.env.DB_NAME || 'ticket_master';
const DB_URL: string = process.env.DB_URL || 'localhost';
const DB_USERNAME: string = process.env.DB_USERNAME || 'root';
const DB_PASSWORD: string = process.env.DB_PASSWORD || 'otcaocOA@6';

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