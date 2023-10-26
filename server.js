const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const app = express();


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//--------------------------------------Mongoose Connection-----------------------------------\\

mongoose.connect("mongodb://127.0.0.1:27017/credentials",{
    useNewUrlParser:true,
    useUnifiedTopology: true
   }).then(()=>{
    console.log("Connected to database");
}).catch(err=>{
    console.log("There is some error in connecting with database",err)
})

//_____________________________________________-MONGOOSE SCHEMA-________________________________________________________________________//

const userSchema =mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter your name',
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: 'Please enter your email',
        trim: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true
    },
    cnfpswd: {
        type: String,
        required: true
    }
},
{
    timestamps:true  
});

const User=new mongoose.model('user', userSchema);

//--------------------------------------ROUTES------------------------------------------------\\
app.get('/login',(req,res)=>{
    res.render('login.ejs')
})
app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})
app.post('/signup',async(req,res)=>{

    try{
        const userSave=new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            cnfpswd : req.body.reEnterPassword
    })
        userSave.save()
        res.redirect('/login')

    }
    catch(err){
        console.log(err)
    }

})

app.post('/Login',(req,res)=>{
    
})







app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
  });