const userUtil = require('../db/userUtil');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

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
    .then(res => {
      // check if user exists
      if (!res.Item) {
        return res.status(422);
      }

      const user = unmarshall(res.Item);

      bcrypt.compare(password, user.password)
        .then( doMatch => {
          if (doMatch) {

          }
        })
        .catch(error => {
          console.log(error);
          return res.status(500);
        })
    })
};