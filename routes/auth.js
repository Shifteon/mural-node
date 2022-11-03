var express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const userUtil = require('../db/userUtil');
var router = express.Router();

router.put('/signup',
  [
    body('user.email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('user.username')
      .trim()
      .custom((value, { req }) => {
        // make sure username doesn't exist
        return userUtil.getUser(value)
          .then(record => {
            if (record.Item) {
              return Promise.reject('Username already in use');
            }
          });
      })
      .not().isEmpty(),
    body('user.password').trim().isLength({ min: 8 })
  ],
  authController.signup
)

router.post('/login',
  [
    body('password').trim().isLength({ min: 8 }),
    body('username').trim().not().isEmpty()
  ],
  authController.login
);

//TODO: add logout route

module.exports = router;