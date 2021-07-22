const express = require('express');
const app = express();
const Story = require('./models/story');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// CONNECTING TO MONGOOSE
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( ()=> console.log("Mongo connected"))
    .catch( (err)=> console.log("Mongo error : ", err)) 


// EJS RELATED
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// EXPRESS ENCODING RELATED OR MIDDLEWARE
app.use('/assets', express.static('assets'))  // to serve css
app.use(express.urlencoded({extended: true}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret: 'notagoodsecret'}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req, res, next)=> {
    res.locals.currentUser = req.user;
    next();
})





// ENDPOINTS
app.get('/', async (req, res) => {
    const stories = await Story.find().sort({date: 'desc'});
    res.render('index.ejs', {stories});
});

app.get('/register', (req, res)=> {
    res.render('register.ejs');
})

app.post('/register', async (req, res)=> {
    const {email, username, password} = req.body;
    const currUser = new User({email, username});
    const registeredUser = await User.register(currUser, password);
    // res.flash('Sign Up successful');
    res.redirect('/');
});
    

app.get('/login', (req, res)=> {
    res.render('login.ejs');
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , (req, res)=> {
    console.log('login successfulllll');
    res.redirect('/');
})

app.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
})



// LISTENING TO THE SERVER
const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log('successfully running');
})