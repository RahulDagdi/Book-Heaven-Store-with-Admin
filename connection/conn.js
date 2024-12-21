const mongoose = require('mongoose');
require('dotenv').config();

const conn = async ()=>{
    try {
        await mongoose.connect(`${process.env.URI}`)
        console.log('Connected to MongoDB');


        
    } catch (error) {
        console.log(error)
    }
}
conn ();




 /***** 2 ******/

// const mongoose =  require ('mongoose');
// require('dotenv').config();

// const MongoURL = `${process.env.URI}` 

// mongoose.connect(MongoURL);

// const db = mongoose.connection ;

// db.on('connected', ()=>{
//     console.log('Connected to MongoDB')
// })
// db.on('disconnected', ()=>{
//     console.log('Disconnected from MongoDB');
// })
// db.on('error', (err)=>{
//     console.log(err);
//     })
//     module.exports = db;