import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import User from "./user.model.js";

const Account = sequelize.define('accounts',
{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    balance:{
        type: DataTypes.FLOAT(10,4),
        allowNull: false
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false
    }
});

User.hasOne(Account, {
    onDelete: 'CASCADE',
});
Account.belongsTo(User);


export default Account;

// sequelize.sync().then(() => {
//     console.log('Accounts table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });