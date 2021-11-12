//greenDragonDBadmin
//6MZQS36EENOShGK0

mongoimport --uri mongodb+srv://greenDragonDBadmin:6MZQS36EENOShGK0 @greendragonflix-db.mtnxm.mongodb.net/greenDragonFlixDB --collection movies --type json --file /Users/krishokr/CF_Projects/db-files/gd-movies-db.json

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

/* rest of code goes here*/
//passing the (app) argument here ensures Express is available in auth.js file as well
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');


//logger -> view in terminal
const morgan = require('morgan');
app.use(morgan('common'));

const uuid = require('uuid');

//Database Name: GreenDragonFlix-db
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/GreenDragonFlix-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send("Welcome to Green Dragon.");
});

//returns all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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

//creates a user
app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req,res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
})

//update name of a specific user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {$set: {
            "Username": req.body.Username,
            "Password": req.body.Password,
            "Email": req.body.Email,
            "Birthday": req.body.Birthday
        }}, {new: true},
        (err, updatedUser) => {
            if (err) {
                res.status(500).send('Error' + error);
            } else {
                res.status(201).send(updatedUser);
            }
        }
        )
});

//adds a new movie to a specified user
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.put('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.get('/users', passport.authenticate('jwt', { session: false }), (req,res)=>{
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
})


//goes into public folder and uses .static on all files in public (documentation.html)
app.use(express.static('public'));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something broke!');
});
  
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

