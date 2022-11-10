const artworkUtil = require('../db/artworkUtil');
const userUtil = require('../db/userUtil');
const { uploadFile } = require('../libs/s3Util');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


exports.uploadArtwork = async (file, username, name, description) => {
  const filename = file.filename;
  // put to S3
  await uploadFile(file);
  // remove file from server
  await unlinkFile(file.path);

  // put to dynamodb
  const date = Date.now().toString();
  const artwork = {
    name: name,
    description: description,
    username: username,
    filekey: filename,
    date: date
  };
  
  let response;
  response = await userUtil.addArtworkToUser(artwork, username);
  if (response.$metadata.httpStatusCode == 200) {
    response = await artworkUtil.putArtwork(artwork);
  }
  return new Promise((resolve, reject) => {
    if (response.$metadata.httpStatusCode == 200) {
      resolve(artwork);
    } else {
      const error = new Error("Error adding artwork to db");
      reject(error);
    }
  });
};