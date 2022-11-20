var express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/artwork/:username', isAuth, userController.getUserArtwork);

router.get('/:username', isAuth, userController.getUserInfo);

router.put('/artwork', isAuth, upload.single('artwork'), userController.addArtworkToUser);

module.exports = router;