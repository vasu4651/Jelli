const express = require('express');
const app = express();
const Story = require('./models/story');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const multer  = require('multer')
const {storage} = require('./config/cloudinary');
const upload = multer({ storage });

// CONNECTING TO MONGOOSE
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( ()=> console.log("Mongo connected"))
    .catch( (err)=> console.log("Mongo error : ", err)) 


// EJS RELATED
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// EXPRESS SESSION
app.use(session({
    secret: 'secretttt',
    resave: true,
    saveUninitialized: true
}));

// Passport config
const passportFunction = require('./config/passport');
passportFunction(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// EXPRESS ENCODING RELATED OR MIDDLEWARE
app.use('/assets', express.static('assets'))  // to serve css
app.use(express.urlencoded({extended: false}));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// dotenv setup
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// setting up global variables for ejs files
app.use( (req, res, next)=> {
    res.locals.currentUser = req.user;
    next();
})


// protecting certain routes
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in first');
    res.redirect('/login');
}








// ENDPOINTS
app.get('/', async (req, res) => {
    const stories = await Story.find().sort({date: 'desc'});
    res.render('index.ejs', {stories});
});

app.get('/register', (req, res)=> {
    res.render('register.ejs');
})


/// register handle
app.post('/register', async (req, res)=> {
    const {email, name, password, password2} = req.body;

    
    // check required fields
    if(!name || !email || !password || !password2){
        return res.render('register.ejs', {msg: 'Please fill all the fields'});
    }
    
    // check passwords match
    if(password !== password2){
        return res.render('register.ejs', {msg: 'Passwords do not match'});
    }

    // check password length 
    if(password.length < 6){
        return res.render('register.ejs', {msg: 'Password should be at least 6 characters'});
    }

    // now check if same email exists in the database
    let user1 = await User.findOne({email: email});
    if(user1)
        return res.render('register.ejs', {msg:'User with this email already exists'});

    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({
        email,
        name,
        password: hash
    });
    console.log(newUser);
    await newUser.save();
    req.flash('success', 'Successfully signed up!! \n Login to continue');
    res.redirect('/login');
});
    

app.get('/login', (req, res)=> {
    res.render('login.ejs', {flashMsg: req.flash('success'), errorMsg: req.flash('error') , errorMsg2: req.flash().error});
})

// login handle
app.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'Username or password incorrect!!'
    })(req, res, next);
});

app.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
})


// post story
app.get('/postStory', ensureAuthenticated, (req, res)=> {
    res.render('postStory.ejs');
})

// handle post new story request
app.post('/postStory', upload.single('image'), async (req, res)=> {
    const {title, text} = req.body;
    const myData = new Story({
        title,
        author: req.user.name,
        text,
        // image : {
        //     url: req.file.path,
        //     filename: req.file.filename
        // }
    });
    if(req.file){
        myData.image.url = req.file.path;
        myData.image.filename = req.file.filename;
    }
    await myData.save();
    // console.log(myData);
    res.redirect('/');
});






// LISTENING TO THE SERVER
const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log('successfully running');
})