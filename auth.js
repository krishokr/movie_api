
const jwtSecret = 'your_jwt_secret';
const { application } = require('express');
//This has to be the same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //local passport file


let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //This is the username you're encoding in the JWT
        expiresIn: '7d', //specifies the token to expire in 7 days
        algorithm: 'HS256' // algorithm used to sign or encode values of JWT
    });
}

// POST login
module.exports = (router) => {
    
    router.post('/login', (req, res) => {
        console.log('hiiiiiiiii');
        passport.authenticate('local', { session: false }, (error, user, info) => {
          if (error || !user) {
            return res.status(400).json({
              message: 'Something is not right',
              user: user
            });
          }
          console.log('login' + req.login);
          req.login(user, { session: false }, (error) => {
            if (error) {
              res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({ user, token });
          });
        })(req, res);
      });
    }