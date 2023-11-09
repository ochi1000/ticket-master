import { sequelize } from "./config.js";

sequelize.sync().then(() => {
    console.log('Ticket table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});