const artworkUtil = require('../db/artworkUtil');
const { uploadFile } = require('../libs/s3Util');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


exports.uploadArtwork = file => {
  const filename = file.filename;

  // put to S3
  uploadFile(file)
    .then(async result => {
      // remove file from server
      await unlinkFile(file.path);

      // put to dynamodb
      const name = req.body.name;
      const description = req.body.description;
      const username = req.body.username;
      const date = Date.now().toString();

      const artwork = {
        name: name,
        description: description,
        username: username,
        filekey: filename,
        date: date
      };
      return artworkUtil.putArtwork(artwork);
    })
    .catch(error => { // error with s3
      console.log(error);
      throw new Error("Error adding artwork to S3");
    });
};