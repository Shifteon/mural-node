const userUtil = require('../db/userUtil');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
  // check for errors
  const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
   }

  let user = req.body.user;
  
  bcrypt
    .hash(user.password, 12)
    .then(hashedPw => {
      user.password = hashedPw;
      // add user to db
      userUtil.putUser(user)
        .then(data => {
          console.log(data);
          res.status(201).send({
            message: "Successfully created user"
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).send({
            message: error.message ||
            "An error occured when creating the user"
          });
        });
    });
};

exports.login = (req, res, next) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const username = req.body.username;
  const password = req.body.password;

  userUtil.getUser(username)
    .then(record => {
      // check if user exists
      console.log(record.Item);
      if (record.Item == undefined) {
        return res.status(422).send({
          message: 'Invalid Credentials!'
        });
      }

      const user = unmarshall(record.Item);

      bcrypt.compare(password, user.password)
        .then( doMatch => {
          if (doMatch) {
            // user is authenticated
            accessToken = jwt.sign(
              { user },
              process.env.TOKEN_SECRET,
              { expiresIn: '1h' }
            );
            return res.status(200).json({
              accessToken: accessToken
            });
          } else {
            // user couldn't be authenticated
            res.status(422).send({
              message: 'Invalid Credentials!'
           });
          }
        })
        .catch(error => {
          console.log(error);
          return res.status(500);
        });
    })
    .catch(error => {
      console.log(error);
      return res.status(500);
    });
};

exports.logout = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  jwt.sign(authHeader, '', { expiresIn: 1 }, (logout, err) => {
     if (logout) {
        res.status(201).send({
           message: 'You have been Logged Out.',
        });
     } else {
        res.status(400).send({
           message: 'Error!',
        });
     }
  });
};