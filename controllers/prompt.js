const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { uploadArtwork } = require('../libs/uploadArtwork');
const { getTodaysPrompt, addArtworkToPrompt, getArtworkFromPrompt } = require('../db/promptUtil');

exports.addArtwork = async (req, res, next) => {
  const file = req.file;
  const username = req.body.username;
  const description = req.body.description;
  const name = req.body.name;
  const dateKey = req.body.dateKey;

  const artwork = await uploadArtwork(file, username, name, description);
  console.log(`line:14 ${artwork}`);
  // add the artwork to the prompt
  addArtworkToPrompt(dateKey, artwork.date, artwork.username)
    .then(result => {
      console.log(result);
      res.status(201).send({
        message: "Successfully added artwork"
      });
    })
    .catch(error => {
      next(error);
    });
};

exports.getPrompt = (req, res, next) => {
  getTodaysPrompt()
    .then(record => {
      if (record.Item) {
        const prompt = unmarshall(record.Item);
        return res.status(200).send({
          prompt: prompt.prompt
        });
      } else {
        const error = new Error("Error getting prompt");
        error.status = 404;
        next(error);
      }
    })
    .catch(error => {
      next(Error(`Error getting prompt ${error}`));
    })
};

exports.getArtwork = (req, res, next) => {
  const dateKey = req.params.dateKey;
  getArtworkFromPrompt(dateKey)
    .then(artwork => {
      res.status(200).send({
        message: "Successfully got artwork",
        artwork: artwork
      });
    })
    .catch(error => {
      next(error);
    })
};