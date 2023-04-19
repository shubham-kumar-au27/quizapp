const passport = require('passport')
const Results = require('../models/results')
const questions = require('../models/question')
const Candidates = require('../models/user')
const Excel = require('exceljs')
const fs = require('fs')
const Noty = require('noty')
 function quizController(){
    //Register candidates----
    return {
        async registerCandidate(req,res){
           const {name,college,email,mobile,rollno} = req.body
            // const Name = req.body.name
            // const college = req.body.college
            // const email = req.body.email   //username is email--
            // const mobile = req.body.mobile
            // const rollno = req.body.rollno
            // const pswrd = req.body.rollno

            console.log(name,college,email,mobile,rollno)
            Candidates.findOne({username:email}).then((data)=>{
                if (data){
                    res.send('user already exists')
                }else{
                    const newUser = new Candidates({
                        Name:name,
                        College:college,
                        username:email,    //username is email--
                        Mobileno:mobile,
                        Rollno:rollno,
                        password:rollno
                    })
                    newUser.save().then((data)=>{
                        if (data){
                            // res.send(data)
                            return res.redirect('/')
                        }
                    }).catch(err=> res.send(err))
                }
            }).catch(err=> res.send(err))
            

            },
            async startTest(req,res){
                const useremail = req.user.username;
                const name = req.user.Name
                const hallticket = req.user.Rollno
                const userId = req.user._id;
                let totalQuestions;
                Results.findOne({emailId:useremail}).then((data)=>{
                    if (data){
                        return res.send('You have already Appeared in this Test..')
                    }
                    
                req.session.testStatus = "active"
                    const result = new Results({
                        emailId:useremail,
                        Name:name,
                        hallTicketNumber:hallticket,
                        totalMarks:70,
                        testStatus:'started'
                    })
                    result.save().then((data)=>{
                        console.log(data)
                        res.redirect('/questions')
                    })
        
                .catch(err => console.log(err))
                }).catch(err => console.log(err))
            },
            async downloadResult(req,res){
                Results.find({}).then((data)=>{
                    
                  
                const workbook = new Excel.Workbook();
                const worksheet = workbook.addWorksheet('Test Results');

                // Add header row
                worksheet.addRow(['Email','Name','Hallticket', 'Total Marks', 'Marks Obtained','Date']);

                data.forEach(item => {
                    worksheet.addRow([
                      item.emailId,
                      item.Name,
                      item.hallTicketNumber,
                      item.totalMarks,
                      item.marksObtained,
                      item.date
                    ]);
                  });
                  // Save workbook
            const fileName = 'test-results.xlsx';
            workbook.xlsx.writeFile(fileName)
            .then(() => {
                console.log(data)
                console.log(`${fileName} has been created successfully.`);
                // Download file
                const file = fs.createReadStream(fileName);
                const stat = fs.statSync(fileName);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                file.pipe(res);
            })

                  // res.send(resp)
                }).catch(err => res.send(err))
        
            },
            async updateMarks(req,res){
                const marksobtained = req.body.marks
                if (! req.user){
                    return res.redirect('/')
                }
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