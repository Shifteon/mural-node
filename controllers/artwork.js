const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { getFileUrl } = require('../libs/s3Util');

exports.addArtwork = (req, res, next) => {
  const file = req.file;
  
};

exports.getArtwork = (req, res) => {
  const key = req.params.key;
  getFileUrl(key)
    .then(url => {
      res.status(200).json({
        url: url
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({
        message: error.message ||
        "An error occured when creating the artwork"
      });
    })
};