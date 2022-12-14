const userUtil = require('../db/userUtil');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { uploadFile } = require('../libs/s3Util');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

exports.signup = async (req, res, next) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    const file = req.file;
    if (file) {
      await unlinkFile(file.path);
    }
    return;
  }

  console.log(req.file);

  if (req.file) {
    const file = req.file;
    const filename = file.filename;
    // put to S3
    await uploadFile(file);
    // remove file from server
    await unlinkFile(file.path);
  } 

  let user = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    profilePic: req.file ? req.file.filename : "",
    artwork: []
  };
  
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
              accessToken: accessToken,
              user: {...user, password: ''}
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
        res.status(500).send({
           message: 'Error!',
        });
     }
  });
};