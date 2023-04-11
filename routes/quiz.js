const createCandidate = require('../controller/user')
const Getquestion = require('../models/question')
function quizRoute(app){
    app.get('/',(req,res)=>{
        return res.render('login')

    })
    app.get('/getquiz',async (req,res)=>{
        if (req.session.isLoggedIn == true){
            res.render('index')
        }else{
            res.send('You are not registered...')
        }
       
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

    app.get('/getquestions',async (req,res)=>{
        const questions = Getquestion.find({}).then((ques)=>{
            // res.render('index',{'question':ques})
            res.json(ques)

        }).catch((err)=>{
            res.send(err)
        })

    })
    app.get('/questions',(req,res)=>{
        res.render('index')
    })

    app.post('/test',createCandidate().createCandidates)


    
}
module.exports = quizRoute