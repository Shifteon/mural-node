var express = require('express');
const { body } = require('express-validator');
const promptController = require('../controllers/prompt');
const isAuth = require('../middleware/isAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const router = express.Router();

router.get('/', isAuth, promptController.getPrompt);

router.put('/addArtwork', isAuth, upload.single('artwork'), promptController.addArtwork);

router.get('/:dateKey', isAuth, promptController.getArtwork);

module.exports = router;