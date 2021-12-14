//Notes:
//  greenDragonDBadmin
//  6MZQS36EENOShGK0
//  Database Name: GreenDragonFlix-db

//----Dependencies----
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());


//Passport.js
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//Username/Password Validation
const { check, validationResult } = require('express-validator');

//logger -> view in terminal
const morgan = require('morgan');
app.use(morgan('common'));

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/GreenDragonFlix-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


//----Endpoints----
app.get('/', (req, res) => {
    res.send("Welcome to Green Dragon.");
});

//creates a user
app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid').isEmail(),
    check('Password', 'Password is required').not().isEmpty()
], (req,res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //hashing password
    let hashedPassword = Users.hashPassword(req.body.Password);

    //checking to see if user already exists..
    Users.findOne({Username: req.body.Username}).then(
        (user) => {
            //if user does exist, send error -> otherwise, create new user
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists')
                
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }).then(user => {
                    res.status(201).json(user)
                }).catch(error => {
                    console.error(error);
                    res.status(500).send('Error' + error);
                })
            }
        }
    ).catch(error=>{
        console.error(error);
        res.status(500).send('Error' + error);
    })
});

//update Username, Password, Email, and Birthday of a specific user
app.put('/users/:Username', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid').isEmail(),
    check('Password', 'Password is required').not().isEmpty()
], passport.authenticate('jwt', { session: false }), (req,res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //hashing password
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({Username: req.params.Username},
        {$set: {
            "Username": req.body.Username,
            "Password": hashedPassword,
            "Email": req.body.Email,
            "Birthday": req.body.Birthday
        }}, {new: true},
        (err, updatedUser) => {
            if (err) {
                res.status(500).send('Error' + err);
            } else {
                res.status(201).send(updatedUser);
            }
        }
        )
});


//adds a new movie to a specified user
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate({Username: req.params.Username},
        {$push: {FavoriteMovies: req.params.MovieID}},
        {new: true},
        (err, updatedUser) => {
            if (err) {
                console.error(error);
                res.status(500).send('Error' + err);
            } else {
                res.json(updatedUser);
            }
        }
        )
});

//removes a movie from user's favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, 
        {$pull: {FavoriteMovies: req.params.MovieID}},
        {new: true},
        (err, updatedMovies) => {
            if (err) {
                console.error(error);
                res.status(500).send('Error ' + error);
            } else {
                res.json(updatedMovies);
            }
        }
        )
})

//deletes a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndRemove({Username: req.params.Username}).then( (user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.')
        } else {
            res.status(201).send(req.params.Username + ' was deleted.');
        }
    }).catch( (err) => {
        console.log('hi');
        console.error(err);
        res.status(500).send('Error' + err);
    })
})

//returns all users
//passport.authenticate('jwt', { session: false }),
app.get('/users', (req,res)=>{
    Users.find().then( (users) => {
        res.status(201).json(users);
    }).catch(error => {
        console.error(error);
        res.status(400).send(error);
    })
});

//returns data about a specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOne({Username: req.params.Username})
    .then(user=> {res.status(201).json(user);})
    .catch(error => {
        console.error(err);
        res.status(500).send('Error' + error);
    })
});

//returns all movies
// passport.authenticate('jwt', { session: false }),
app.get('/movies', (req, res) => {
    Movies.find().then(movies => {
        res.status(201).send(movies);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error ' + error);
    })
})

//get a specific movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({"Title": req.params.Title}).then((movie) => {
        if (movie) {
            res.status(201).json(movie);
        } else {
            res.status(400).send(req.params.Title + ' has vanished!');
        }
        
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
    })  
})

//return data about a genre by name/title
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({"Genre.Name": req.params.Genre}, {Genre: 1, _id: 0}).then((genre) => {
        if (genre) {
            console.log(genre);
            res.status(201).json(genre);
        } else {
            res.status(400).send(req.params.Genre + ' does not rule in this kingdom.');
        }
        
    }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
    })
});

//return data about a director
app.get('/directors/:Director',passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({"Director.Name": req.params.Director}, {"Director": 1, "_id": 0}).then((director) => {
        if (director) {
            res.status(201).json(director);
        } else {
            res.status(400).send(req.params.Director + ' has vanished!');
        }
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error ' + error);
    })
});

//----Static Pages----
app.use(express.static('public'));


//----Error Handling----
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something broke!');
});

//----Connecting to Server----
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

