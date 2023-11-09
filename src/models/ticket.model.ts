import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import Account from "./account.model.js";
import AcquiredTicket from "./acquired_ticket.model.js";

const Ticket = sequelize.define('tickets',
{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    cost:{
        type: DataTypes.FLOAT(10,4),
        allowNull: false
    }
});

export default Ticket;

// sequelize.sync().then(() => {
//     console.log('Ticket table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });
