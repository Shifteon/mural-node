const { getArtworkFromUser } = require('../db/userUtil');

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