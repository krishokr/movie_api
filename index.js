const express = require('express');
const app = express();
//adding preexisting logging library that replaces myLogger()
//can view log in terminal when change between pages
const morgan = require('morgan');
app.use(morgan('common'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const uuid = require('uuid');

let users = [
    { 
        "name" : "Frodo Baggins", 
        "email" : "f.baggins@theShire.net", 
        "favoriteMovies" : [], 
        "password" : "leadMe2Mordor!" 
    }
];

let topMovies = [
    {
        title: "Lord of the Rings: Fellowship of the Ring",
        featured: true,
        genre: {
            name: "epic",
            description: "Flying bison, mystical wizards, knights in shining armour, spiritual gurus in a far off land, a meeting with dwarves and elvish folk... pack your bag with mead and Lembas for the long journey ahead."
        },
        director: {
            name: "Peter Jackson",
            bio: "Sir Peter Robert Jackson is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of the Lord of the Rings trilogy (2001–03) and the Hobbit trilogy (2012–14), both of which are adapted from the novels of the same name by J. R. R. Tolkien. Other notable films include the critically lauded drama Heavenly Creatures (1994), the horror comedy The Frighteners (1996), the epic monster remake film King Kong (2005), and the World War I documentary film They Shall Not Grow Old (2018). He is the third-highest-grossing film director of all-time, his films having made over $6.5 billion worldwide.",
            birthday: "October 31, 1961"
        },
        description: "The film tells the story of young hobbit Frodo Baggins who, accompanied by eight companions, embarks on a journey to destroy the One Ring in the fires of Mount Doom."
    },
    {
        title: "Indiana Jones: Raiders of the Lost Ark",
        featured: true,
        genre: {
            name: "action",
            description: "You're on an exotic island taking a early-morning dip in the ocean before being served cocktails and Vesper Martinis for lunch, gambling with billionaires before dinner, and rescuing a damsel in distress by night... all with your iconic weapon of choice that defines your style and, possibly, compensating for your lack of confidence due to deep dark secrets about your past yet to be uncovered."
        },
        director: {
            name: "Steven Spielberg",
            bio: "Steven Allan Spielberg is an American film director, producer, and screenwriter. He began his career in the New Hollywood era, and is currently the most commercially successful director. Spielberg is the recipient of various accolades, including two Academy Awards for Best Director, a Kennedy Center honor, and a Cecil B. DeMille Award.",
            birthday: "December 18, 1946"
        },
        description: "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before Adolf Hitler's Nazis can obtain its awesome powers. The year is 1936. An archeology professor named Indiana Jones is venturing in the jungles of South America searching for a golden statue. With his whip and wits, nothing can outsmart him, until..."
    },
    {
        title: "Avatar: The Last Airbender",
        featured: true,
        genre: {
            name: "epic",
            description: "You're on an exotic island taking a early-morning dip in the ocean before being served cocktails and Vesper Martinis for lunch, gambling with billionaires before dinner, and rescuing a damsel in distress by night... all with your iconic weapon of choice that defines your style and, possibly, compensating for your lack of confidence due to deep dark secrets about your past yet to be uncovered."
        },
        director: {
            name: "Dave Filoni",
            bio: "David Filoni is an American film and television director, voice actor, television writer, television producer, and animator. He has worked on Avatar: The Last Airbender, The Mandalorian, and on the theatrical film and television series of Star Wars: The Clone Wars. He was also the creator and an executive producer on Star Wars Rebels for all four seasons, and served as its supervising director for all but the third season, in which Justin Ridge served as supervising director while Filoni accepted a promotion to oversee all of Lucasfilm Animation projects.[2] Filoni is also credited as one of the writers and executive producers of the web series Star Wars Forces of Destiny, and as the creator of the 2018–2020 animated series Star Wars Resistance and the 2021 animated series Star Wars: The Bad Batch.",
            birthday: "June 7, 1974"
        },
        description: "Water, Earth, Fire, Air. Long ago, the four nations lived together in harmony. Then, everything changed when the fire nation attacked. Only the Avatar, master of all four elements could stop them. But when the world needed him most, he vanished. A hundred years passed and my brother and I discovered the new Avatar, an Airbender named Aang. And although his airbending skills are great, he has a lot to learn before he's ready to save anyone. But I believe Aang can save the world."
    },
    {
        title: "Spectre",
        featured: true,
        genre: {
            name: "action",
            description: "You're on an exotic island taking a early-morning dip in the ocean before being served cocktails and Vesper Martinis for lunch, gambling with billionaires before dinner, and rescuing a damsel in distress by night... all with your iconic weapon of choice that defines your style and, possibly, compensating for your lack of confidence due to deep dark secrets about your past yet to be uncovered."
        },
        director: {
            name: "Sam Mendes",
            bio: "Sir Samuel Alexander Mendes is a British film and stage director, producer, and screenwriter. In theatre, he is known for his dark re-inventions of the stage musicals Cabaret (1993), Oliver! (1994), Company (1995), and Gypsy (2003). He directed an original West End stage musical for the first time with Charlie and the Chocolate Factory (2013). For directing the play The Ferryman, Mendes was awarded the Tony Award for Best Direction of a Play in 2019.",
            birthday: "1 August 1965"
        },
        description: "A cryptic message from James Bond's past sends him on a trail to uncover the existence of a sinister organisation named SPECTRE. With a new threat dawning, Bond learns the terrible truth about the author of all his pain in his most recent missions."
    }
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    // {
    //     title: 
    //     director:
    //     description:
    // },
    
]



app.get('/', (req, res) => {
    res.send("Welcome to Green Dragon.");
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//goes into public folder and uses .static on all files in public (documentation.html)
app.use(express.static('public'));

app.get('/movies/:title', (req,res) => {
    //.find() searches each object (called movie)in the topMovies array to find a movie with the title that matches the title in the req parameter
    console.log('Finding movie based on title..');
    res.json(topMovies.find((movie) => {
        return movie.title === req.params.title;
    }))
});



//not sure if the result should be description about a certain genre (which means I need an array describing each genre), or if the result should be movies that belong to that genre
app.get('/genres/:genre', (req,res) => {
    console.log('Finding all movies based on genre..');

    let movies = [];
    topMovies.forEach((movie) => {

        if (movie.genre.name === req.params.genre) {
            console.log('adding movies to list..');
            movies.push(movie);
        }
    })
    res.json(movies);
});

app.get('/directors/:director', (req,res) =>{
    console.log(req.params.director)
    let movie = topMovies.find((movie) => {
        return req.params.director === movie.director.name;
    })
    console.log("This is the movie with director" + movie);
    res.json(movie.director)
});


//says cannot GET register...
app.post('/register', (req,res) => {
    let user = req.body;
    console.log(req.body);
    if (!user.name || !user.email || !user.password) {
        
        const message = "Missing name, email, or password in request body.";
        res.status(400).send(message);
    } else {
        user.id = uuid.v4();
        users.push(user);
        res.status(201).send(user);
    }
});

app.put('/accounts/:username/:name?/:email?/:password?', (req,res) => {
    let user = users.find((user) => {
        return user.email === req.params.username;
    });

    let nameUpdatedMessage = '';
    let emailUpdatedMessage = '';
    let passwordUpdatedMessage= '';

    if (req.params.name) {
        user.name = req.params.name;
        nameUpdatedMessage = 'Name ' + req.params.name + ' has been updated.';
    }
    if (req.params.email) {
        user.email = req.params.email;
        emailUpdatedMessage = 'Email ' + req.params.email + ' has been updated.';
    }
    if (req.params.password) {
        user.password = req.params.password;
        passwordUpdatedMessage = 'Password has been updated.';
    }

    res.status(201).send(nameUpdatedMessage + emailUpdatedMessage + passwordUpdatedMessage);
});


app.put('/favoriteMovies/:username/:title', (req,res) => {
    let user = users.find((user) => {
        return user.email === req.params.username;
    });

    let movie = topMovies.find((movie) => {
        return movie.title === req.params.title;
    })
    
    if (user.favoriteMovies.includes(req.params.title)) {
        res.status(400).send("You already added your favorite movie.");
    } else {
        user.favoriteMovies.push(movie);
        res.status(400).send("You have successfully added your favorite movie.");
    }
    
});

app.delete('/favoriteMovies/:username/:title', (req,res) => {
    let user = users.find((user) => {
        return user.email === req.params.username;
    });

    function returnIndex() {
        //.map() returns array of all movie titles, then .indexOf() uses movie title to find index of movie
        return user.favoriteMovies.map(movie => movie.title).indexOf(req.params.title);
    }
        
    if (returnIndex() !== -1) {
        user.favoriteMovies.splice(returnIndex(), 1);
        res.status(201).send("Movie was successfully deleted.");
    } else {
        res.status(400).send("Cannot find movie.");
    }

});

app.delete('/users/:username', (req,res) => {

    function returnIndex() {
        //.map() returns array of all movie titles, then .indexOf() uses movie title to find index of movie
        return users.map(user => user.email).indexOf(req.params.username);
    }
       
    if (returnIndex() !== -1) {
        users.splice(returnIndex(), 1);
        res.status(201).send("Your account " + req.params.username + " has been deleted.");
    } else {
        res.status(400).send("Your account cannot be found.");
    }
})



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something broke!');
});
  
app.listen(8080, () => {
console.log('Your app is listening on port 8080.');
});
