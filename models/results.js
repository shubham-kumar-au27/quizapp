const mongoose = require('mongoose');
const Schema = mongoose.Schema;

resultSchema = new Schema( {
    Name:{
        type:String,
        required: true,
    },
    Rollno:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"unregistered"
    },
    marks:{
        type:Number,
        // required:true
        default:0
    },
    result:{
        type:String,
        default:'pending'

    },
    date :{ type : Date, default: Date.now }
})
results = mongoose.model('result',resultSchema);

module.exports = results;