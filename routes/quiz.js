const createCandidate = require('../controller/user')
const Getquestion = require('../models/question')
const passport = require('passport')
const results = require('../models/results')
function quizRoute(app){

    app.get('/',(req,res)=>{
        return res.render('login')

    })
    app.get('/getquiz',async (req,res)=>{
        res.render('index')
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

    app.get('/starttest',async (req,res)=>{
        if (req.user.test )
        res.render('test/starttest')
    })

    app.post('/starttest',createCandidate().startTest)
    app.get('/questions',(req,res)=>{
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

    app.post('/submitResults',(req,res)=>{
        const totalMarks = req.query.totalMarks
        const marksObtained =req.query.marksObtained
    })

}
module.exports = quizRoute