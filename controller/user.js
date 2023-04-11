 const Candidates = require('../models/results')
 function quizController(){
    //Register candidates----
    return {
        async createCandidates(req,res){
            const name = req.body.name
            const enrolment = req.body.enrolmentId
            const status = 'registered'


            try {
                // Check if user already exists
                const existingUser = await Candidates.findOne({ Rollno: enrolment });
                if (existingUser) {
                    res.set('Content-Type', 'text/html');
                    return res.render('registered')
                //   throw new Error('candidate  already registered..');
                // res.send('user already registered....')
                }
                const newUser = new Candidates({
                    Name:name,
                    Rollno:enrolment,
                    status:status
                })
            
                // If user does not exist, create a new user
                const createdUser = await Candidates.create(newUser);
                // console.log('New user created:', createdUser)
                req.session.isLoggedIn = true
                req.session.Rollno = enrolment
                res.set('Content-Type', 'text/plain');
                res.redirect('/questions')
                // res.render('index')
              } catch (err) {
                console.error(err);
                throw err;
              }
            }

        
        
        }

    }


module.exports = quizController