const passport = require('passport')
const Results = require('../models/results')
const questions = require('../models/question')
const Candidates = require('../models/user')
 function quizController(){
    //Register candidates----
    return {
        async registerCandidate(req,res){
            const Name = req.body.name
            const college = req.body.college
            const email = req.body.username   //username is email--
            const mobile = req.body.mobile
            const rollno = req.body.rollno
            const pswrd = req.body.rollno
            Candidates.findOne({username:email}).then((data)=>{
                if (data){
                    res.send('user already exists')
                }else{
                    const newUser = new Candidates({
                        Name:Name,
                        College:college,
                        username:email,    //username is email--
                        Mobileno:mobile,
                        Rollno:rollno,
                        password:pswrd
                    })
                    newUser.save().then((data)=>{
                        if (data){
                            res.send(data)
                        }
                    }).catch(err=> res.send(err))
                }
            }).catch(err=> res.send(err))
            

            },
            async startTest(req,res){
                const useremail = req.user.username;
                const userId = req.user._id;
                let totalQuestions;
                Results.findOne({emailId:useremail}).then((data)=>{
                    if (data){
                        return res.send('You Have Already Appeared in this Test..')
                    }
                    
                req.session.testStatus = "active"
                questions.find({}).then((data)=>{
                    totalQuestions = data.length

                    const result = new Results({
                        emailId:useremail,
                        totalMarks:totalQuestions,
                        testStatus:'started'
                    })
                    result.save().then((data)=>{
                        console.log(data)
                        res.redirect('/questions')
                    })

                })
                .catch(err => console.log(err))
                }).catch(err => console.log(err))

            },
            async updateMarks(req,res){
                const marksobtained = req.body.marks
                const userid = req.user.username
                Results.findOneAndUpdate(
                    { emailId: userid },
                    { $inc: { questionsAttempted: 1, marksObtained: marksobtained } },
                    { new: true },
                ).then(result => res.send(result)).catch(err => res.send(err))
            }
    }
    }
module.exports = quizController