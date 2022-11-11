const { getArtworkFromUser } = require('../db/userUtil');
const { uploadArtwork } = require('../libs/uploadArtwork');

exports.getUserArtwork = (req, res, next) => {
  const username = req.params.username;
  getArtworkFromUser(username)
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

exports.addArtworkToUser = (req, res, next) => {
  const username = req.body.username;
  const file = req.file;
  const description = req.body.description;
  const name = req.body.name;

  uploadArtwork(file, username, name, description)
    .then(artwork => {
      res.status(201).send({
        message: "Successfully added artwork",
        artwork: artwork
      });
    })
    .catch(error => {
      next(error);
    })
};