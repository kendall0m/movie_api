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
// const bodyParser = require ('body-parser');

// app.use(bodyParser.json());



//Connecting to my database using the databases found via mongosh sho dbs() command
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

//Older API calls from lesson 2.5
app.get("/", (req, res) => {
    let responseText = "Hello world! Welcome to my Movie API!?";
    res.send(responseText);
});

// Get all movies
app.get('/movies', async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});


  // Get all users
app.get('/allusers', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// return data about a movie by title
app.get('/movies/:Title', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })  
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data about a genre by title
app.get('/movies/genre/:Genre', async (req, res) => {
  await Movies.findOne({ Genre: req.params.Genre })  
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data about a director by name
app.get('/movies/directors/:Director', async (req,res) => {
  await Movies.findOne({ Director: req.params.Director })  
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
app.post('/newuser', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
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
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
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
app.delete('/users/:Username/:MovieID', async (req, res) => {
  await Movies.findOneAndRemove({ Title: req.params.MovieID }).then((movies) => {
    if (movies) {
      res.status(400).send(req.params.MovieID + ' was not found');
    } else {
      res.status(200).send(req.params.MovieID + ' was deleted');
    }
  });
});

// Delete a user by username
app.delete('/deleteuser/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});