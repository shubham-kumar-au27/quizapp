const createCandidate = require('../controller/user')
const user = require('../middlewares/user')
const Getquestion = require('../models/question')
const passport = require('passport')
const results = require('../models/results')
const canditate = require('../models/user')
function quizRoute(app){

    app.get('/',(req,res)=>{
        if ( !req.user){
            return res.render('login')
        }else if (req.session.testStatus == "active"){
            return res.redirect('/questions')
        }else{
            return res.redirect('/starttest')
        }

    })
    app.get('/questionUpdate',async (req,res)=>{
        const email = req.user.username
            results.findOne({emailId:email}).then((result)=>{
                console.log(result)
                res.send(result)
            }).catch(err => res.send(err))
        
    })
    
    app.post('/createQuestion',async (req,res)=>{
        const question = req.body.question
        const options = req.body.options
        const correct = req.body.answer



        const create = new Getquestion({
            question:question,
            options:options,
            correctanswer:correct
        })
        const createdquestion = await Getquestion.create(create)

        res.send(createdquestion)
    })

    app.get('/starttest',user,async (req,res)=>{
        if (req.session.testStatus == "active"){
            return res.redirect('questions')
        }
        
        res.render('test/starttest')
    })

    app.post('/starttest',createCandidate().startTest)
    app.get('/questions',user,(req,res)=>{
        Getquestion.find({}).then((ques)=>{
            res.render('test/index',{'question':JSON.stringify(ques)})
        }).catch((err)=>{
            res.send(err)
        })
    })
    app.get('/register',(req,res)=>{
        res.render('register')
    })
    app.post('/register',createCandidate().registerCandidate)  //for registration---

    app.get('/login',(req,res)=>{
        res.render('login')
    })

    app.post('/login',passport.authenticate('local',{successRedirect:'/starttest',failureRedirect:'/'}),()=>{});

    app.post('/updateMarks',createCandidate().updateMarks)

    app.get('/logout',(req,res)=>{
        req.session.destroy((err)=>{
            if (err){
                console.log(err)
            }else{
                res.redirect('/')
            }
        })

    })

}
module.exports = quizRoute