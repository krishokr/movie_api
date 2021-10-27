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


// //middleware function that console logs request url
// let myLogger = function(req, res, next) {
//     console.log(req.url);
//     //next allows next middleware function to be called
//     next();
// }

// let requestTime = function(req, res, next) {
//     req.requestTime = Date.now();
//     //next allows function to be called by whichever of the two routes corresponds to the current request
//     next();
// }

// //this designates myLogger should be used on every request below (in all app.get functions)
// app.use(myLogger);
// //second middleware function
// app.use(timeStamp);


// app.get('/', (req, res) => {
//     let responseText = 'Welcome to my app!';
//     //can access .requestTime method in requestTime() middleware function above
//     responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//     res.send(responseText);
//   });
  
//   app.get('/secreturl', (req, res) => {
//     let responseText = 'This is a secret url with super top-secret content.';
//     responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//     res.send(responseText);
  
//   });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something broke!');
});
  
app.listen(8080, () => {
console.log('Your app is listening on port 8080.');
});
