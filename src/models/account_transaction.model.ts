import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import Account from "./account.model.js";

const AccountTransaction = sequelize.define('transactions',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    source:{
        type: DataTypes.UUID,
        allowNull: true
    },
    destination:{
        type: DataTypes.UUID,
        allowNull: true
    },
    payment_gateway:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    amount:{
        type: DataTypes.FLOAT(10,4),
        allowNull: false
    },
});

// associations
Account.hasMany(AccountTransaction,{foreignKey: 'source', as:'debit'});
Account.hasMany(AccountTransaction,{foreignKey: 'destination', as:'credit'});

AccountTransaction.belongsTo(Account);

export default AccountTransaction;

    // sequelize.sync().then(() => {
    //     console.log('Transactions table created successfully!');
    // }).catch((error) => {
    //     console.error('Unable to create table : ', error);
    // }); 