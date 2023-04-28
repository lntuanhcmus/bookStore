import express from 'express';
import cors  from 'cors';
require('dotenv').config();
import Route  from './src/routes';
import db  from './connection_database';

db.connectDB();


//Create app from an instance of express
const app = express();

/* config middleware*/
// 1. setup cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE']
}))

// 2. Get data as json string form submit form and get special function
app.use(express.json());
app.use(express.urlencoded({extended: true})); // only using for express with ver > 4.6

/* Router */
Route(app);

/* Turn On an app with spcific port */
const PORT = process.env.PORT || 3000

const listener = app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));