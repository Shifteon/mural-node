const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { getArtwork } = require('../db/artworkUtil');

const TABLE_NAME = "prompts";

exports.getTodaysPrompt = () => {
  const date = new Date();
  const dateKey = `${date.getUTCMonth()}${date.getUTCDate()}${date.getUTCFullYear()}`

  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ date: dateKey })
  }
  const command = new GetItemCommand(params);
  return ddbClient.send(command);
}

exports.addArtworkToPrompt = (dateKey, date, username) => {
  const artworkKey = marshall([{ date: date, username: username }]);
  console.log(artworkKey);
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ date: dateKey }),
    UpdateExpression: 'set artwork = list_append(:artworkKey, artwork)',
    ExpressionAttributeValues: { ':artworkKey': {"L": artworkKey } }
  }

  const command = new UpdateItemCommand(params);
  return ddbClient.send(command);
}

exports.getArtworkFromPrompt = async (dateKey) => {
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ date: dateKey })
  }
  const command = new GetItemCommand(params);
  const result = await ddbClient.send(command);
  const artworkList = [];
  if (result.$metadata.httpStatusCode == 200) {
    const item = unmarshall(result.Item);

    for (const artworkKey of item.artwork) {
      const artwork = await getArtwork(artworkKey.date, artworkKey.username);
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
      error.status = 404;
      reject(error);
    }
  });
};