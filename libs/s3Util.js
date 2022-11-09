const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
// Set the AWS Region.
const REGION = "us-west-2";
const BUCKET_NAME = "mural-images";

exports.uploadFile = (file) => {
  // Create an Amazon DynamoDB service client object.
  const s3Client = new S3Client({ region: REGION });

  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: BUCKET_NAME,
    Body: fileStream,
    Key: file.filename
  };
  const command = new PutObjectCommand(params);

  return s3Client.send(command);
};

exports.getFileUrl = async (fileKey) => {
  // Create an Amazon DynamoDB service client object.
  const s3Client = new S3Client({ region: REGION });

  const params = {
    Key: fileKey,
    Bucket: BUCKET_NAME
  };
  const command = new GetObjectCommand(params);

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  if (url) {
    return url;
  } else {
     next(new Error("Failed to retrieve from S3"));
  }
};