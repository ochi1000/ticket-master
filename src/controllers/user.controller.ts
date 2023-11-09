import { Request, Response, response } from "express";
import User from "../models/user.model.js";
import {hash, compare} from "bcrypt";
import Account from "../models/account.model.js";
import jwt from "jsonwebtoken";

const register = async (req:Request, res:Response) => {
    var{username, password} = req.body;

    if(!username || !password){
        return res.status(401).send({message:'Send all required fields'})
    }

    // check username
    const usernameUsed = await User.findOne({
        where: {
            username:username
    }})

    if(usernameUsed){
        return res.send({message: 'Username already used'})
    }

    // hash password
    const hashedPassword = await hash(password, 10)

    var newUser = {
        username: username,
        password: hashedPassword
    };


    // Create User
    User.create(newUser, {validate: true}).then(userData =>{
        return res.status(201).send({
            data:{userData}, 
            message: 'Registeration successful'
        });
    }).catch((error) =>{
        console.error('Failed to create a new record : ', error);
        return res.status(401).send({message: 'Error occured, please try again'});
    });

};

const login = async (req:Request, res:Response) => {

    var{username, password} = req.body;

    if(!username && !password){
        return res.status(401).send({message:'Send all required fields'})
    }

    // check username
    const userExists = await User.findOne({
        where: {
            username:username
        },
        include:{
            model: Account
        }
    })
    if(!userExists){
        return res.send({message: 'User does not exist'})
    }

    const userPassword: string = userExists.toJSON().password

    // validate password
    const validCredentials = await compare(password, userPassword)
    if(!validCredentials){
        return res.send({message: 'Username or Password incorrect'})
    }

    // User login
    let payload = { id: userExists.toJSON().id };
    let token = jwt.sign(payload, process.env.SECRET??'1234567');
    return res.send({user:userExists, token, message: 'User login successful'})

};

export {register, login}