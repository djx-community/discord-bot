const  { v4 : uuidv4 } = require('uuid');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id : {type:String,default:uuidv4},
    fullname:{type:String,required:true},
    phone:{type:Number,required:true},
    discordId:{type:String,requied:true}
})


const userModel = mongoose.model('users',userSchema);
module.exports =  {userModel}
