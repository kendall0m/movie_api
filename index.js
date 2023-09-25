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
        title: 'Spirited Away',
        director: {
            name: 'Hayao Miyazaki',
            bio: 'Hayao Miyazaki was born on January 5, 1941, in Tokyo City, Empire of Japan, the second of four sons.	',
            birthYear: '1941',
            deathYear: 'n/a',
        },
        description: '10-year-old Chihiro finds herself in a mysterious world after her parents are turned into pigs.',
        genre: 'Fantasy',
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
        genre: 'Animation',
        image: '',
    },
    {
        title: 'My Neighbor Totoro',
        director: {
            name: 'Hayao Miyazaki',
            bio: 'Hayao Miyazaki was born on January 5, 1941, in Tokyo City, Empire of Japan, the second of four sons.	',
            birthYear: '1941',
            deathYear: 'n/a',
        },
        description: 'This acclaimed animated tale follows schoolgirl Satsuke and her younger sister, Mei.',
        genre: 'Fantasy',
        image: '',
    },
    {
        title: 'Ponyo',
        director: {
            name: 'Hayao Miyazaki',
            bio: 'Hayao Miyazaki was born on January 5, 1941, in Tokyo City, Empire of Japan, the second of four sons.	',
            birthYear: '1941',
            deathYear: '--',
        },
        description: 'Three war veterans face A goldfish princess encounters a human boy.',
        genre: 'Fantasy',
        image: '',
    },
    {
        title: 'Detective Pikachu',
        director: {
            name: 'Rob Letterman',
            bio: 'Robert Thomas Letterman is an American film director and screenwriter.',
            birthYear: '1970',
            deathYear: '--',
        },
        description: 'Pikachu helps a boy find his missing father.	',
        genre: 'Mystery',
        image: '',
    },
    {
        title: 'Big Fish',
        director: {
            name: 'Tim Burton',
            bio: 'Timothy Walter Burton is an American filmmaker, animator, and artist.',
            birthYear: '1958',
            deathYear: '--',
        },
        description: 'A man recounts fantastical tales of his life.	',
        genre: 'Comedy',
        image: '',
    },
    {
        title: 'The Secret World of Arrietty',
        director: {
            name: 'Hiromasa Yonebayashi',
            bio: 'Hiromasa Yonebayashi, nicknamed Maro, is a Japanese animator and director, formerly for Studio Ghibli.	',
            birthYear: '1973',
            deathYear: 'n/a',
        },
        description: 'Arrietty, a tiny teenager, lives with her parents in the recesses of a suburban home, unbeknown to the homeowner and housekeeper.',
        genre: 'Fantasy',
        image: '',
    },
    {
        title: 'The Sound of Music	',
        director: {
            name: 'Robert Wise	',
            bio: 'Robert Earl Wise was an American film director, producer, and editor.	',
            birthYear: '1914',
            deathYear: '2005',
        },
        description: 'Julie Andrews plays the role of Maria, the tomboyish postulant at an Austrian abbey who becomes a governess in the home of a widowed naval captain with seven children, and brings a new love of life and music into the home.	',
        genre: 'Musical',
        image: '',
    },
    {
        title: 'Princess Mononoke',
        director: {
            name: 'Hayao Miyazaki',
            bio: 'Hayao Miyazaki was born on January 5, 1941, in Tokyo City, Empire of Japan, the second of four sons.	',
            birthYear: '1941',
            deathYear: '--',
        },
        description: 'In the 14th century, the harmony that humans, animals and gods have enjoyed begins to crumble. The protagonist, young Ashitaka - infected by an animal attack, seeks a cure from the deer-like god Shishigami.	',
        genre: 'Fantasy',
        image: '',
    },
    {
        title: 'Sailor Moon Eternal	',
        director: {
            name: 'Chiaki Kon',
            bio: 'Chiaki Kon is a Japanese anime director. She started her career in 1998 after joining Pierrot.	',
            birthYear: 'unknown',
            deathYear: '--',
        },
        description: 'When a dark power enshrouds the Earth after a total solar eclipse, the scattered Sailor Guardians must reunite to bring light back into the world.	',
        genre: 'Animation',
        image: '',
    }
];

let directors = [
    {
        name: 'Hayao Miyazaki',
        bio: 'Hayao Miyazaki was born on January 5, 1941, in Tokyo City, Empire of Japan, the second of four sons.',
        birthYear: '1941',
        deathYear: 'n/a',
    },
    {
        name: 'Rob Letterman',
        bio: 'Robert Thomas Letterman is an American film director and screenwriter.',
        birthYear: '1970',
        deathYear: '--',
    },
    {
        name: 'Tim Burton',
        bio: 'Timothy Walter Burton is an American filmmaker, animator, and artist.',
        birthYear: '1958',
        deathYear: '--',
    },
    {
        name: 'Hiromasa Yonebayashi',
        bio: 'Hiromasa Yonebayashi, nicknamed Maro, is a Japanese animator and director, formerly for Studio Ghibli.	',
        birthYear: '1973',
        deathYear: 'n/a',
    },
    {
        name: 'Robert Wise	',
        bio: 'Robert Earl Wise was an American film director, producer, and editor.	',
        birthYear: '1914',
        deathYear: '2005',
    },
    {
        name: 'Brad Bird',
        bio: 'directed The Iron Giant',
        birthYear: '1957',
        deathYear: 'n/a',
    },
];

let users = [
    {
        id: '1',
        username: 'Astarion',
        password: 'secretvampire666',
        email: 'amethystartefact@gmail.com',
        birthDate: '12/23/1460',
        faveList: {
            faveMovie1: 'My Neighbor Totoro',
            faveMovie2: 'The Sound of Music',
        },
    },
    {
        id: '2',
        username: 'Karlach',
        password: 'n0tam0nster',
        email: 'flamechest@gmail.com',
        birthDate: '06/05/1464',
        faveList: {
            faveMovie1: '',
        },
    },
    {
        id: '3',
        username: 'Shadowheart',
        password: 'trustno1',
        email: 'sharsfavoriteprincess@gmail.com',
        birthDate: '09/15/1466',
        faveList: {
            faveMovie1: '',
        },
    },

];

let genres = [
    {
        id: '1',
        genre: 'Fantasy',
        description: 'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology or folklore.',
    },
    {
        id: '2',
        genre: 'Mystery',
        description: 'Mystery is a fiction genre where the nature of an event, usually a murder or other crime, remains mysterious until the end of the story.',
    },
    {
        id: '3',
        genre: 'Comedy',
        description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.',
    },
    {
        id: '4',
        genre: 'Musical',
        description: 'Musical film is a film genre in which songs by the characters are interwoven into the narrative, sometimes accompanied by dancing.',
    },
    {
        id: '5',
        genre: 'Animation',
        description: 'Animation is the method that encompasses myriad filmmaking techniques, by which still images are manipulated to create moving images.',
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
    res.json(directors.find((director) => {

        return director.name === req.params.director;

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
app.post('/movies/:username/favorites/:favemovie', (req, res) => {
    let user = users.find((user) => { return user.id === req.params.id});
    if(user){
        user.faveList.faveMovie1 = req.params.favemovie;
        res.status(201).send("Favorite movie was added to your list!");
    }else{
        res.status(404).send("This user does not exist.");
    }

});


// allow users to remove a movie from their list of favorites
app.delete('/movies/:username/deletefavorites/:favemovie', (req, res) => {
    let user = users.find((user) => {return user.id === req.params.id});

    if (user) {
        user.faveList.favemovie1 = '';
        res.status(201).send('The movie was deleted.');
    }else{
        res.status(404).send('This is not a movie in the database.')
    }
});

// allow existing users to deregister
app.delete('/users/:username/deregister', (req, res) => {
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