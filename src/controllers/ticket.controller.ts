import { Request, Response } from "express";
import Ticket from "../models/ticket.model.js";
import Account from "../models/account.model.js";
import { sequelize } from "../config.js";
import AcquiredTicket from "../models/acquired_ticket.model.js";
import AccountTransaction from "../models/account_transaction.model.js";

const createTicket =async (req:Request, res:Response) => {

    try {
        // validate fields
        var{name, cost} = req.body;

        if (!name || !cost || isNaN(cost)) {
            return res.status(400).send({message: 'Send all required fields'});
        }
        cost = parseFloat(cost);
        const newTicket = {
            name:name, 
            cost:cost
        }
        // create ticket
        Ticket.create(newTicket, {validate: true}).then(ticketData => {
            return res.status(201).send({ticket:ticketData, message:'Ticket created'});
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
            return res.status(400).send({message: 'Error occured, please try again'});
        });
    } catch (error) {
        console.error('Failed to create a new record : ', error);
        return res.status(400).send({message: 'Error occured, please try again'});
    }
    
}

const acquireTicket =async (req:Request, res:Response) => {
    var {account_id, ticket_id} = req.body;

    // Validate fields
    if (!account_id || !ticket_id) {
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
    // check ticket exists
    const ticket = await Ticket.findOne({
        where: {
            id:ticket_id,
        }
    });
    if (!ticket) {
        return res.status(400).send({message:'Account does not exist'});
    }

    // check if account already has ticket
    const already_acquired = await AcquiredTicket.findOne({
        where:{
            accountId: account_id,
            ticketId: ticket_id
        }
    });
    if(already_acquired){
        return res.status(400).send({message:'ticket already acquired'});
    }

    // check if account balance can acquire ticket
    const balance = account.toJSON().balance;
    const ticket_price = ticket.toJSON().cost;
    if (balance < ticket_price) {
        return res.status(400).send({message:'insufficient funds'});
    } 

    const new_balance = balance - ticket_price;
    const admin_account_id = '0f52d070-7dcc-11ee-ab7e-4b01e70164d7';

    // acquire ticket transaction
    try {

        await sequelize.transaction(async (t) => {

            //   debit account
            await Account.update({balance: new_balance},{ 
            where:{
                id: account_id
            }, transaction: t})

            // record ticket acquired
            const ticked_acquired = await AcquiredTicket.create({
                accountId: account_id,
                ticketId: ticket_id
            }, { transaction: t });
            
            // record transaction
            const account_transaction = await AccountTransaction.create({
            source: account_id,
            destination: admin_account_id,
            amount: ticket_price
            }, { transaction: t });
      
            return res.status(200).send({data: account_transaction, message:'Transaction successful'});
      
        });
      
      } catch (error) {
        console.log(error);
        return res.status(400).send({message: 'Error occured please try again'});
      }
    
}

export {createTicket, acquireTicket}