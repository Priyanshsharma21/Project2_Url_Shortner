const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode : {
        type : String ,
        required : true , 
        unique : true , 
        lowercase : true,
        trim : true 
    },
    longUrl : {
        type : String ,
        required : true ,
        validate : {
            validator : function(value){
                const urlRegex = /^(https?|ftp?| http):\/\/[^\s/$.?#].[^\s]*$/;
                return urlRegex.test(value)
            },
            message : "Invailed URL format"
        }
    },
    shortUrl : {
        type : String , 
        required : true ,
        unique : true
    } 
})

module.exports = mongoose.model('Url',urlSchema)