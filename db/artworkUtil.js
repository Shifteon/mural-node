const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = "artwork";

exports.putArtwork = (artwork) => {
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(artwork)
  };
  const command = new PutItemCommand(params);
  return ddbClient.send(command);
};

exports.getArtwork = (date, username) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ date: date, username: username })
  }
  const command = new GetItemCommand(params);
  return ddbClient.send(command);
}

exports.getArtworkFromTable = async (key, tableName) => {
  const params = {
    TableName: tableName,
    Key: marshall(key)
  }
  const command = new GetItemCommand(params);
  const result = await ddbClient.send(command);
  const artworkList = [];
  if (result.$metadata.httpStatusCode == 200) {
    const item = unmarshall(result.Item);

    for (const artworkKey of item.artwork) {
      const artwork = await exports.getArtwork(artworkKey.date, artworkKey.username);
      if (artwork.$metadata.httpStatusCode == 200) {
        artworkList.push(unmarshall(artwork.Item));
      }
    }
  }
  return new Promise((resolve, reject) => {
    if (artworkList.length > 0) {
      resolve(artworkList);
    } else {
      const error = new Error("No artwork found");
      error.statusCode = 404;
      reject(error);
    }
  });
};