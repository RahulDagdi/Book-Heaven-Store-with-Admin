const mongoose = require ('mongoose');

const book = new mongoose.Schema ({
             url : {
                type : String ,
                    require : true 
             },
             title : {
                type : String ,
                require : true
             },
             author : {
                type : String ,
                required : true 
             },
             
             price :{
                type : Number ,
                require : true
             },
             description : {
                type : String ,
                require : true
             },
             language : {
                type : String ,
                require : true
             },
             



},
{timestamps : true}
)

module.exports = mongoose.model ('books', book)