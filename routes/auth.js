var express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const userUtil = require('../db/userUtil');
const isAuth = require('../middleware/isAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var router = express.Router();

router.put('/signup', upload.single('profilePic'),
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('username')
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
    body('password').trim().isLength({ min: 8 })
      .withMessage('Password must have 8 or more characters'),
    body('name').not().isEmpty().withMessage("Name can't be empty"),
    body('bio').not().isEmpty().withMessage("Bio can't be empty")
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

router.get('/logout', isAuth, authController.logout);

module.exports = router;