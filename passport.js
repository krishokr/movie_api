//NOTE: INSTALL PASSPORT USING  npm install —save passport passport-local passport-jet jsonwebtoken


const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;




//1. LocalStrategy defines basic HTTP authentication for login requests -> takes in a username and password from req body and uses Mongoose to check database for user with same username (password not checked here) -> if match, function is executed
passport.use(new LocalStrategy({
    //taking in username/password from req body
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    //searching db via Mongoose
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
          }
        //if username exists, returns back user object
        console.log('finished');
        return callback(null, user);
    });
}));

//2. JWTStrategy authenticates users based on JWT submitted in request -> JWT extracted from header of HTTP request

passport.use(new JWTStrategy({
    //JWT is called the bearer token
    
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //secret used to verify signature of JWT
    secretOrKey: 'fly_green_movies'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));