import { sequelize } from "./config.js";
import Account from "./models/account.model.js";
import AccountTransaction from "./models/account_transaction.model.js";
import AcquiredTicket from "./models/acquired_ticket.model.js";
import Ticket from "./models/ticket.model.js";
import User from "./models/user.model.js";

User;
Account;
AccountTransaction;
Ticket;
AcquiredTicket

sequelize.sync().then(() => {
    console.log('Table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});