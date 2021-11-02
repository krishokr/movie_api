let user = {name: 'joe', favoriteMovies: [{title: 'lotr'}, {title: 'pirate'}, {title: 'return'}]};

let movieToRemove = '';

function returnIndex() {
    return user.favoriteMovies.map(movie => movie.title).indexOf(movieToRemove);
}


    
if (returnIndex() !== -1) {
    user.favoriteMovies.splice(returnIndex(), 1);
    console.log('movie removed!')
} else {
    console.log('movie doesnt exist')
}
    
console.log(user.favoriteMovies)





