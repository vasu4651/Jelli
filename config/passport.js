const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load user model
const User = require('../models/user');

module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        console.log('user search for logging in fail');
                        return done(null, false, "This email is not registered");
                    }

                    // If user found then matching password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch){
                            console.log('match password true');
                            return done(null, user);
                        }
                        else{
                            console.log('match password fail');
                            return done(null, false, "Password incorrect");
                        }
                    })

                })
                .catch((err) => console.log(err));
        })
    );

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
        // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}