const { validationResult } = require('express-validator');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { uploadArtwork } = require('../libs/uploadArtwork');
const { getTodaysPrompt, addArtworkToPrompt, getArtworkFromPrompt, getPreviousPrompts } = require('../db/promptUtil');

exports.addArtwork = async (req, res, next) => {
  if (!req.file) {
    res.status(400).send({
      message: "Please upload some artwork"
    });
    return;
  }

  const file = req.file;
  const username = req.body.username;
  const description = req.body.description;
  const name = req.body.name;
  const dateKey = req.body.dateKey;

  const artwork = await uploadArtwork(file, username, name, description);
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
          prompt: prompt
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
    });
};

exports.getPrevious = (req, res, next) => {
  getPreviousPrompts()
    .then(result => {
      let prompts = result.Items.map(prompt => unmarshall(prompt));
      const date = new Date();
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      console.log(prompts);
      console.log(year);
      console.log(month);
      console.log(day);
      prompts = prompts.filter(p => {
        const date = p.date.split(",");
        return date[0] < year || date[0] == year && (date[1] < month || date[1] == month && date[2] <= day);
      });
      res.status(200).send({
        message: "Successfully got prompts",
        prompts: prompts
      });
    })
    .catch(error => {
      next(error);
    });
};