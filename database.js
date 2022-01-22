const mongoose =require('mongoose');
require('dotenv').config()
async function startConnection(){
    await mongoose.connect('mongodb://localhost/testemailuiriid', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(()=>{
        console.log('database is connected');
    }, error=>{
        console.log(error)
    })
    
}
//`mongodb+srv://CoEnzym:${process.env.MDP}@coenzymdb.proil.mongodb.net/CoEnzymDB?retryWrites=true&w=majority`

module.exports = startConnection;