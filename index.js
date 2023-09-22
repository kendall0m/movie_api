const express = require('express');
const morgan = require ('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const app = express();
const path = require('path');
const uuid = require ('uuid');
const bodyParser = require ('body-parser');

app.use(bodyParser.json());

const movies = [
    {
        title: 'The Hunt for Red October',
        director: {
            name: 'John McTiernan',
            bio: 'directed The Hunt for Red October',
            birthYear: '1951',
            deathYear: 'n/a',
        },
        description: 'Based on a Tom Clancy novel.',
        genre: 'drama',
        image: '',
    },
    {
        title: 'The Iron Giant',
        director: {
            name: 'Brad Bird',
            bio: 'directed The Iron Giant',
            birthYear: '1957',
            deathYear: 'n/a',
        },
        description: 'A boy meets an iron giant.',
        genre: 'adventure',
        image: '',
    },
    {
        title: 'The Philadelphia Story',
        director: {
            name: 'George Cukor',
            bio: 'directed The Philadelphia Story.',
            birthYear: '1899',
            deathYear: '1983',
        },
        description: 'Katharine Hepburn is in it.',
        genre: 'comedy',
        image: '',
    },
    {
        title: 'The Best Years of Our Lives',
        director: {
            name: 'William Wyler',
            bio: 'directed The Best Years of Our Lives',
            birthYear: '1902',
            deathYear: '1981',
        },
        description: 'Three war veterans face difficulties.',
        genre: 'drama',
        image: '',
    },
    {
        title: 'The Caine Mutiny',
        director: {
            name: 'Edward Dmytryk',
            bio: 'directed The Caine Mutiny',
            birthYear: '1908',
            deathYear: '1999',
        },
        description: 'Takes place during World War II.',
        genre: 'suspense',
        image: '',
    },
    {
        title: 'The Godfather',
        director: {
            name: 'Francis Ford Coppola',
            bio: 'directed The Godfather',
            birthYear: '1939',
            deathYear: 'n/a',
        },
        description: 'Involves the mafia I think.',
        genre: 'drama',
        image: '',
    },
    {
        title: 'Seabiscuit',
        director: {
            name: 'Gary Ross',
            bio: 'directed Seabiscuit',
            birthYear: '1956',
            deathYear: 'n/a',
        },
        description: 'About a horse.',
        genre: 'horse',
        image: '',
    },
    {
        title: 'Pulp Fiction',
        director: {
            name: 'Quentin Tarantino',
            bio: 'directed Pulp Fiction',
            birthYear: '1963',
            deathYear: 'n/a',
        },
        description: 'Uma Thurman is in this!',
        genre: 'drama',
        image: '',
    },
    {
        title: 'Secretariat',
        director: {
            name: 'Randall Wallace',
            bio: 'directed Secretariat',
            birthYear: '1949',
            deathYear: 'n/a',
        },
        description: 'About a horse.',
        genre: 'horse',
        image: '',
    },
    {
        title: 'True Grit',
        director: {
            name: 'Ethan Coen',
            bio: 'directed True Grit',
            birthYear: '1957',
            deathYear: 'n/a',
        },
        description: 'A girl goes on a quest.',
        genre: 'drama',
        image: '',
    }
];

let users = [
    {
        id: '1A',
        username: 'Gale',
        faveList: {
            faveMovie1: '',
        },
    },

    {
        id: '2B',
        username: 'Astarion',
        faveList: {
            faveMovie1: '',
        },
    },
    {
        id: '3C',
        username: 'ShadowHeart',
        faveList: {
            faveMovie1: 'Seabiscuit',
        }
    }
];

let genres = [
    {
        genre: 'horse',
        description: 'horse movies are about horses in some way. this is a genre i made up for humor.',
    },
    {
        genre: 'drama',
        description: 'drama movies are really dramatic.',
    },
    {
        genre: 'suspense',
        description: 'suspense movies are movies that have you on the edge of your seat'
    },
]

app.use(morgan('common'));

app.get("/", (req, res) => {
    let responseText = "Hello world! Welcome to my Movie API!?";
    res.send(responseText);
});

// gets list of movies 
app.get('/movies', (req, res) => {
    res.json(movies);
});

// return data about a movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

// return data about a genre by title


app.get('/movies/genre/:genre', (req,res) => {
    res.json(genres.filter((genre) =>
    { return genre.genre === req.params.genre }));
});

// return data about a director by name
app.get('/movies/directors/:director', (req,res) => {
    res.json(movies.find((movie) => {

        return movie.director.name === req.params.director;

    }));
});

// allow new users to register 
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.username) {
        const message = 'Missing a username in request body';
        res.status(400).send(message);
    }   else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }

});

// allow users to update their username
app.put('/users/:oldName/:newName', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.oldName});

    if (user) {
        user.username = req.params.newName;
        res.status(201).send('Your username was updated to ' + req.params.newName);
    } else {
        res.status(404).send('This user does not exist.');
    }

});

// allow users to add a  movie to their list of favorites
app.post('/movies/:id/favorites/:favemovie', (req, res) => {
    let user = users.find((user) => { return user.id === req.params.id});
    if(user){
        user.faveList.faveMovie1 = req.params.favemovie;
        res.status(201).send("Favorite movie was added to your list!");
    }else{
        res.status(404).send("This user does not exist.");
    }

});


// allow users to remove a movie from their list of favorites
app.delete('/movies/:id/deletefavorites/:favemovie', (req, res) => {
    let user = users.find((user) => {return user.id === req.params.id});

    if (user) {
        user.faveList.favemovie1 = '';
        res.status(201).send('The movie was deleted.');
    }else{
        res.status(404).send('This is not a movie in the database.')
    }
});

// allow existing users to deregister
app.delete('/users/:id/deregister', (req, res) => {
    let user = users.find((user) => {return user.id === req.params.id});

    if (user) {
        users = users.filter((obj) => {return obj.id !== req.params.id});
        res.status(201).send('user ' + req.params.id + ' was deleted.');
    }
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