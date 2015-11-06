const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// POST	Create a user.
router.post('/users', function (req, res) {
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password; // TODO: Hash passwords

  user.save(function(err) {
      if (err) res.json(err);
      res.json({ message: 'User created!' });
  });
});

// POST Authenticates a user
router.post('/login', function (req, res) {
  if (!req.body || !req.body.username || !req.body.password)
    return res.sendStatus(400);

  const failResponse = {
    success: false,
    message: 'Username or password incorrect!',
    status: 'danger'
  }
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) res.json(err);

    if (!user) {
      res.json(failResponse);
    } else if (user) {

      // Check if password matches
      if (user.password != req.body.password) {
        res.json(failResponse);
      } else {

        // Create a token
        var token = jwt.sign({ _id: user._id, admin: user.admin }, process.env.JSON_TOKEN_SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Login successful!',
          status: 'success',
          token: token
        });
      }
    }
  });
});

// Require 'Authorization' header for all following routes
router.use(function(req, res, next) {
  const header = req.headers.authorization;
  if (header) {
    const token = header.substr(7); // String 'Bearer ' off
    jwt.verify(token, process.env.JSON_TOKEN_SECRET, function(err, decoded) {
      if (err) {
        return res.json(err);
      } else {
        // Save to request for use in other routes
        req.current_user = decoded;
        next();
      }
    });
  } else {

    return res.status(401).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

// GET	Get all the users.
router.get('/users', function (req, res) {
  if (!req.current_user.admin) {
    res.sendStatus(403);
  } else {

    User.find(function(err, users) {
      if (err) res.json(err);
      res.json(users);
    });
  }
});

// GET	Get a single user.
router.get('/users/:id', function (req, res) {
  var user = User.findById(req.params.id, function(err, user) {
    if (err) res.json(err);
    res.json(user.username);
  });
});

// Require current user to be the owner for the following routes
router.use(function(req, res, next) {
  if (req.current_user._id !== req.params._id) {
    res.sendStatus(403);
  }
});

// PUT	Update a user with new info.
router.put('/users/:id', function (req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.json(err);

    user.password = req.body.password; // TODO: Hash passwords
    user.modified = Date.now;

    user.save(function(err) {
      if (err) res.json(err);
      res.json({ message: 'Password changed!' });
    })
  });
});

// DELETE	Delete a user.
router.delete('/users/:id', function (req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    if (err) res.json(err);
    res.json({ message: 'Account deleted!' });
  });
});

module.exports = router;
