// BUILD YOUR SERVER HERE
const express = require('express');
// const users = require('./users/model.js');
const { find, findById, insert, update, remove } = require('./users/model.js');

//Instance of express app

const server = express();

//Global Middleware
server.use(express.json());

// [POST] req at /api/users

server.post('/api/users', async (req, res) => {
  const newUserInfo = req.body;

  try {
    if (!newUserInfo.name || !newUserInfo.bio) {
      res.status(400).json('Please provide name and bio for the user');
    } else {
      const newUser = await insert(newUserInfo);
      if (!newUser) {
        res.status(500).json({
          message: 'There was an error while saving the user to the database',
        });
      } else {
        res.status(201).json(newUser);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [GET] req at /api/users fetch all users

server.get('/api/users', (req, res) => {
  find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// [GET] req at /api/users/:id fetch all users

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json('The user with the specified ID does not exist');
      } else {
        res.status(202).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//[PUT] req at /api/users/:id edit user

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    res.status(422).json('Name & Bio required.');
  } else {
    update(id, changes)
      .then((updatedUser) => {
        if (!updatedUser) {
          res
            .status(404)
            .json('The user with the specified ID does not exist.');
        } else {
          res.status(201).json(updatedUser);
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

//[DELETE] req at /api/users/:id

server.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await remove(id);

    if (!deletedUser) {
      res.status(422).json('User does not exist.');
    } else {
      res.status(201).json(deletedUser);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

server.use('*', (req, res) => {
  res.status(404).json({ message: 'Princess is in another castle' });
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
