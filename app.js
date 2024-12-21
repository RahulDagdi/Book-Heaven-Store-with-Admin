const express = require('express') ;
const app = express();
const cors = require ('cors');
require('dotenv').config();
const conn = require ('./connection/conn');
const User = require ('./routes/user')
const Books = require ('./routes/book')
const Favourite = require ('./routes/favourite');
const Cart = require('./routes/cart')
const Order = require('./routes/order')

// Middleware to parse JSON payloads
app.use(cors());
app.use(express.json());


// routes
app.use('/api/v1' , User) ;
app.use('/api/v1' , Books) ;
app.use('/api/v1' , Favourite) ;
app.use('/api/v1' , Cart) ;
app.use('/api/v1' , Order) ;


//create port
const PORT = process.env.PORT ;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
