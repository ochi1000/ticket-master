import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import Account from "./account.model.js";
import Ticket from "./ticket.model.js";

const AcquiredTicket = sequelize.define('acquired_tickets',
{
    accountId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
          }
    },
    ticketId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Ticket,
            key: 'id'
        }
    }
});
Account.belongsToMany(Ticket, { through: AcquiredTicket });
Ticket.belongsToMany(Account, { through: AcquiredTicket });

export default AcquiredTicket;

// sequelize.sync().then(() => {
//     console.log('AcquiredTickets table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });

