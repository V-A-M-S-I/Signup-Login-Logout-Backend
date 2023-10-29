const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//--------------------------------------Initializing Session -----------------------------------\\

app.use(session({
    secret:"Chittiprolu Venkata Vamsi.",
    resave:false,
    saveUninitialized:false

}))

//--------------------------------------Initializing Passport -----------------------------------\\

app.use(passport.initialize());
app.use(passport.session());

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

const userSchema =new mongoose.Schema({
    username: {
        type: String,
        required: 'Please enter your name',
        trim: true
    },
    email: {
        type: String,
        required: 'Please enter your email',
        trim: true,
        lowercase:true
    },
    password: {
        type: String,    
    }
},
{
    timestamps:true  
});

//--------------------------------------plugin passportlocalmongoose above the userSchema -----------------------------------\\
userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model('user', userSchema);

//--------------------------------------Initializing passport dependences below userSchema -----------------------------------\\

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//--------------------------------------ROUTES------------------------------------------------\\
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, redirect to the home page
    res.redirect('/home');
  } else {
    // If not authenticated, show the login form
    res.render('login');
  }
});

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error('Error during logout:', err);
    }
    res.redirect('/'); // Redirect to the login page after logout
  });
});

app.get('/home',(req,res)=>{

    if(req.isAuthenticated()){
        res.render('home')
    }else{
        res.redirect('/')
    }
    
})


app.post('/signup', (req, res) => {
    User.register(
      new User({
        username: req.body.username,
        email: req.body.email
      }),
      req.body.password,
      function (err, user) {
        if (err) {
          console.error('Error in registration:', err);
          return res.redirect('/signup');
        }
        console.log("Creating session");
        
        // Use passport.authenticate to authenticate the user
        passport.authenticate('local')(req, res, function () {
            console.log(("created the session"))
          res.redirect('/home');
        });
      }
    );
  });
  
// try{
    //     const userSave=new User({
    //         name : req.body.name,
    //         email : req.body.email,
    //         password : req.body.password,
    //         cnfpswd : req.body.reEnterPassword
    // })
    //     userSave.save()
    //     res.redirect('/login')

    // }
    // catch(err){
    //     console.log(err)
    // }



    app.post('/',(req,res)=>{
      const user = new User({
        email:req.body.email,
        password:req.body.passpword
      });
      
      req.login(user, function(err) {
        if (err) {console.log (err); }
        else{res.redirect('/home')}
      });
    })







app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
  });