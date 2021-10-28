const express = require('express');
const app = express();
//adding preexisting logging library that replaces myLogger()
//can view log in terminal when change between pages
const morgan = require('morgan');
app.use(morgan('common'));

let topMovies = [
    {
        title: "Lord of the Rings: Fellowship of the Ring",
        director: "Peter Jackson",
        description: "The film tells the story of young hobbit Frodo Baggins who, accompanied by eight companions, embarks on a journey to destroy the One Ring in the fires of Mount Doom."
    },
    {
        title: "Indiana Jones: Raiders of the Lost Ark",
        director: "Steven Spielberg",
        description: "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before Adolf Hitler's Nazis can obtain its awesome powers. The year is 1936. An archeology professor named Indiana Jones is venturing in the jungles of South America searching for a golden statue."
    }
    // {
    //     title: ""
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
    // {
    //     title: 
    //     director:
    //     description:
    // },
    
]




app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send("Welcome to Green Dragon.");
});

//goes into public folder and uses .static on all files in public (documentation.html)
app.use(express.static('public'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something broke!');
});
  
app.listen(8080, () => {
console.log('Your app is listening on port 8080.');
});
