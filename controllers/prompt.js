const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { uploadArtwork } = require('../libs/uploadArtwork');

exports.addArtwork = (req, res) => {
  const file = req.file;
  uploadArtwork(file)
    .then(data => {
      console.log(data);
      res.status(201).send({
        message: "Successfully created artwork",
        filename: filename
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({
        message: error.message ||
        "An error occured when creating the artwork"
      });
    });
};

exports.getPrompt = (req, res) => {
  
};