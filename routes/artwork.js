var express = require('express');
const { body } = require('express-validator');
const artworkController = require('../controllers/artwork');
const userUtil = require('../db/userUtil');
const isAuth = require('../middleware/isAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const router = express.Router();

router.put('/', isAuth, upload.single('image'), artworkController.addArtwork);

router.get('/:key', isAuth, artworkController.getArtwork);

module.exports = router;