import { Request, Response, response } from "express";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import AccountTransaction from "../models/account_transaction.model.js";
// import AccountTransaction from "../models/transaction.model.js";    

const create = async (req:Request, res:Response) => {

    var{userId} = req.body

    try {
        if(!userId){
            return res.status(401).send({message:'Send required field'})
        }
    
        // check user exists
        const userExists = await User.findOne({
            where: {
                id:userId
            }
        });
        if(!userExists){
            return res.status(400).send({message: 'User does not exist'})
        }
    
        // check account exists
        const accountExists = await Account.findOne({
            where: {
                userId:userId,
            }
        });
        if(accountExists){
            return res.status(400).send({message: 'User already has an account'})
        }
        const balance = 0.0000;
    
        var accountDetails = {
            userId: userId,
            balance: balance
        };
    
        // Create Ticket Account
        await Account.create(accountDetails, {validate: true}).then(accountData => {
            return res.status(201).send({
                data:{accountData}, 
                message: 'Ticket account created successful'});
        }).catch((error) =>{
            console.error('Failed to create a new record : ', error);
            return res.status(401).send({message: 'Error occured, please try again'});
        });

    } catch (error) {
        console.error(error);
        return res.status(401).send({message: 'Error occured, please try again'});
    }
};

const balance = async (req:Request, res:Response) => {
    var{account_id} = req.body;

    // check account exists
    const accountExists = await Account.findOne({
        where: {
            id:account_id,
        }
    });
    if(!accountExists){
        return res.status(404).send({message: 'Account does not exists'})
    }

    // Get balance
    const balance = accountExists?.toJSON().balance;
    return res.status(200).send({balance});

}

const getAccountDetails =async (req:Request, res:Response) => {
    var {account_id} = req.body;

    // Validate fields
    if (!account_id) {
        return res.status(400).send({message: 'Send all required fields'});
    }
    
    // check account exists
    const account = await Account.findOne({
        where: {
            id:account_id,
        },
        include: [{model: AccountTransaction, as: 'credit', required: false}, {model: AccountTransaction, as: 'debit', required: false}]
    });
    if (!account) {
        return res.status(400).send({message:'Account does not exist'});
    }

    // return account and transactions
    return res.status(200).send({account})
}


export {create, balance, getAccountDetails}