const express = require('express');
const morgan = require ('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const app = express();
const path = require('path');

const topMovies = [
    {
        title: 'The Hunt for Red October',
        director: 'John McTiernan',
    },
    {
        title: 'The Iron Giant',
        director: 'Brad Bird',
    },
    {
        title: 'The Philadelphia Story',
        director: 'George Cukor',
    },
    {
        title: 'The Best Years of Our Lives',
        director: 'William Wyler',
    },
    {
        title: 'The Caine Mutiny',
        director: 'Edward Dmytryk',
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
    },
    {
        title: 'Seabiscuit',
        director: 'Gary Ross',
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
    },
    {
        title: 'Secretariat',
        director: 'Randall Wallace',
    },
    {
        title: 'True Grit',
        director: 'Ethan Coen',
    }
]
app.use(morgan('common'));


//gets list of movies 
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get("/", (req, res) => {
    let responseText = "Hello world!";
    res.send(responseText);
});


app.use(express.static('public'));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});