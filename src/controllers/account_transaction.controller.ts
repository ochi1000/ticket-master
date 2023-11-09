import { Request, Response } from "express";
import Account from "../models/account.model.js";
import { sequelize } from "../config.js";
import AccountTransaction from "../models/account_transaction.model.js";
import { Op } from "sequelize";

const creditUserFromPaymentGateway =async (req:Request, res:Response) => {
    // after processing payment from payment gateway
    var {amount, dst_account} = req.body;

    // Validate fields
    if (!dst_account || !amount) {
        return res.status(400).send({message: 'Send all required fields'});
    }
    if (isNaN(amount)) {
        return res.status(400).send({message: 'Stop playing...'});
    }
    
    // check destination account exists
    const dst_accountExists = await Account.findOne({
        where: {
            id:dst_account,
        }
    });
    if(!dst_accountExists){
        return res.status(400).send({message: 'Destination account does not exist'});
    }
    amount = parseFloat(amount);

    // get destination account balance
    const dstBalance = dst_accountExists.toJSON().balance;
    // new destination account balance
    const newDstBalance = dstBalance + amount;

    // Start transaction
    try {

        await sequelize.transaction(async (t) => {
      
            //   credit destination account
            await Account.update({balance: newDstBalance},{ 
                where:{
                    id: dst_account
                }, 
                transaction: t
            });

            // record transaction
            const account_transaction = await AccountTransaction.create({
            payment_gateway: true,
            destination: dst_account,
            amount: amount
            }, { transaction: t });
      
            return res.status(201).send({data: account_transaction, message:'Transaction successful'});
      
        });
      
      } catch (error) {
        console.log(error);
        return res.status(401).send({message: 'Error occured please try again'});
      }

}

const creditUserFromUser =async (req:Request, res:Response) => {
    var {src_account, dst_account, amount } = req.body

    // Validate fields
    if (!src_account || !dst_account || !amount) {
        return res.status(400).send({message: 'Send all required fields'});
    }
    if (src_account === dst_account || isNaN(amount)) {
        return res.status(400).send({message: 'Stop playing...'});
    }
    
    // check source & destination account exists
    const src_accountExists = await Account.findOne({
        where: {
            id:src_account,
        }
    });
    const dst_accountExists = await Account.findOne({
        where: {
            id:dst_account,
        }
    });
    if(!src_accountExists){
        return res.status(400).send({message: 'Source account does not exist'});
    }
    if(!dst_accountExists){
        return res.status(400).send({message: 'Destination account does not exist'});
    }
    amount = parseFloat(amount);

    // check if scource account has enough balance
    const srcBalance = src_accountExists.toJSON().balance;
    
    if(srcBalance < amount){
        return res.status(400).send({message: 'insufficient funds'});
    }
    
    // new source account balance
    const newSrcBalance = srcBalance - amount; 

    // get destination account balance
    const dstBalance = dst_accountExists.toJSON().balance;
    // new destination account balance
    const newDstBalance = dstBalance + amount;


    // Start transaction
    try {

        await sequelize.transaction(async (t) => {

            //   debit source account
            await Account.update({balance: newSrcBalance},{ 
            where:{
                id: src_account
            }, transaction: t})
      
            //   credit destination account
            await Account.update({balance: newDstBalance},{ 
            where:{
                id: dst_account
            }, transaction: t})

            // record transaction
            const account_transaction = await AccountTransaction.create({
            source: src_account,
            destination: dst_account,
            amount: amount
            }, { transaction: t });
      
            return res.status(201).send({data: account_transaction, message:'Transaction successful'});
      
        });
      
      } catch (error) {
        console.log(error);
        return res.status(401).send({message: 'Error occured please try again'});
      }
}

const getTransactions =async (req:Request, res:Response) => {

    var {account_id, start_date, end_date} = req.body;

    // Validate fields
    if (!account_id) {
        return res.status(400).send({message: 'Send all required fields'});
    }
    
    // check account exists
    const account = await Account.findOne({
        where: {
            id:account_id,
        }
    });
    if (!account) {
        return res.status(400).send({message:'Account does not exist'});
    }

    
    if (start_date) {
        
        // validate dates
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        
        if(isNaN(start_date.getDate()) || isNaN(end_date.getDate())){
            return res.status(400).send({message: 'invalid date'})
        }

        // fetch transactions and sort
        const transactions = await AccountTransaction.findAll({
            where:{
                [Op.or]: [
                { source: account_id },
                { destination: account_id }
            ], [Op.and]:[

                {createdAt: {
                    [Op.gt]: start_date,
                    [Op.lt]: end_date,
                }}
            ]
            
            },
        });
        return res.status(200).send({transactions});

    } else {
        
        // fetch transactions without sorting
        const transactions = await AccountTransaction.findAll({
            where:{
                [Op.or]: [
                { source: account_id },
                { destination: account_id }
            ]}
        });
        return res.status(200).send({transactions});
    }


}

export {creditUserFromPaymentGateway, creditUserFromUser, getTransactions}