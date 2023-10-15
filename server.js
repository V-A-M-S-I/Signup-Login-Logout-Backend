const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const app = express();


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

//--------------------------------------Mongoose Connection-----------------------------------\\
mongoose.connect("mongodb://127.0.0.1:27017/credentials",{
    useNewUrlParser:true,
   }).then(()=>{
    console.log("Connected to database");
}).catch(err=>{
    console.log("There is some error in connecting with database",err)
})

//_____________________________________________-MONGOOSE SCHEMA-________________________________________________________________________//

const userSchema = new mongoose.Schema({
  name:
  {
      type:String,
      required: true,
      unique: true,
      trim:true,
      maxLenght:[20,"your name is up to 20 chars long."]
  },
  email:
  {
      type:String,
      required: true,
      trim:true
  },
  password:
  {
      type:String,
      required:true,
      trim:true
  },
})

const credentials = mongoose.model("credentials",userSchema)

//--------------------------------------ROUTES------------------------------------------------\\
app.get('/',(req,res)=>{
    res.render("login.ejs")
})
app.get('/signup',(req,res)=>{
    res.render("signup.ejs")
})
app.get('/home', (req, res) => {
    if (req) {
      // If the user is logged in, pass the user data to the template
      res.render('home', { user: req.user });
    } else {
      // If the user is not logged in, pass user as null
      res.render('home', { user: null });
    }
});









app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
  });