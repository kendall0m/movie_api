
// require("dotenv").config();
const dotnev = require('dotenv');
dotnev.config();
const mongoose = require('mongoose');
const Models = require('./models.js');


const Movies = Models.Movie;
const Users = Models.User;
const express = require('express');
const morgan = require ('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
const uuid = require ('uuid');
const bodyParser = require ('body-parser');

app.use(bodyParser.json());

// let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://kendallsmovies-85beffe7056c.herokuapp.com', 'https://kendallsmovies-85beffe7056c.herokuapp.com/movies'];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             let message = 'The CORS policy for this application doesn\'t allow access from origin' + origin;
//             return callback(new Error(message), false);
//         }
//       return callback(null, true);
//       }  
//     }));
// const cors = require('cors');
// CORS

//allow specific set of origins to access your API
// app.use(cors());



// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Pass to next layer of middleware
//   next();
// });

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');


//Connecting to my database using the databases found via mongosh sho dbs() command
// mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//testing push

app.use(morgan('common'));

//Older API calls from lesson 2.5
app.get("/", (req, res) => {
    let responseText = "Hello world! Welcome to my Movie API!";
    res.send(responseText);
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
      .then((movies) => {
        res.status(500)
          // res.status(201).json(movies);
      })
      .catch((err) => {
          console.error(err);
          res.status(400).send('An Error occurred: ' + err);
      })
});

// app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//    Movies.find()
//     .then((movies) => {
//       res.status(201).json(movies);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });


  // Get all users
app.get('/allusers', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// return data about a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })  
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data about a genre by title
app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })  
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data about a director by name
app.get('/movies/directors/:Director', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne({ 'Director.Name': req.params.Director })  
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', 
  //validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // search to see if a user with requested username already exists
    .then((user) => {
      if (user) {
      //if user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  //validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


// allow users to remove a movie from their list of favorites
app.delete('/users/:Username/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.MovieID }).then((movies) => {
    if (movies) {
      res.status(400).send(req.params.MovieID + ' was not found');
    } else {
      res.status(200).send(req.params.MovieID + ' was deleted');
    }
  });
});

// Delete a user by username
app.delete('/deleteuser/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});