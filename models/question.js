const mongoose = require('mongoose');
const Schema = mongoose.Schema


const questions = new Schema({
    question:{
        type:String,
    },
    options:{
        type:[String],
        required:true
    },
    
    correctanswer:{
        type:String,
        required:true
    }


})


const Question = mongoose.model('Question', questions);

module.exports = Question;


