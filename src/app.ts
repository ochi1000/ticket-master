import express from "express";
import { sequelize } from "./config.js";
import userRoute from "./routes/user.route.js";
import accountRoute from "./routes/account.route.js";
import transactionRoute from "./routes/account_transaction.route.js";
import ticketRoute from "./routes/ticket.route.js";
import passport from "passport";
import { middleware } from "./middleware/authenticate.js";


const app = express();

//middleware for parsing request body
app.use(express.json());

// use middleware
passport.use(middleware);

// use initialize passport middleware
app.use(passport.initialize());


// Middleware for handling CORs Policy
// Allow all origins
// app.use(cors()) 

app.get('/', (req, res) =>{
    console.log(req);
    return res.status(200).send('Welcome Home')
}); 

app.use('/', userRoute);
app.use('/account', passport.authenticate(middleware, {session:false}), accountRoute);
app.use('/transaction', passport.authenticate(middleware, {session:false}), transactionRoute);
app.use('/ticket', passport.authenticate(middleware, {session:false}), ticketRoute);


// Connect Database and Start Application
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    app.listen(5000, () => {
        console.log(`App is listening on: 5000`);
    });
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });