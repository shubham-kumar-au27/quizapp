function quizRoute(app){
    app.get('/',(req,res)=>{
        return res.render('index.ejs')

    })
      

    
}
module.exports = quizRoute