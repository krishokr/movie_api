const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    //format for if a value is required below
    Title: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Biography: String,
        Birth: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//creates a collection called db.movies and db.users (changes to plural and lowercase)
module.exports.Movie = Movie;
module.exports.User = User;

