var express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const userUtil = require('../db/userUtil');
var router = express.Router();

router.put('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('username')
      .trim()
      .not().isEmpty()
      .custom((value, { req }) => {
        // make sure username doesn't exist
        userUtil.getUser(value)
          .then(res => {
            if (res.item) {
              return Promise.reject('Username already in use');
            }
          });
      }),
    body('password').trim().isLength({ min: 8 })
  ],
  authController.signup
)

//TODO: add login route

//TODO: add logout route

module.exports = router;