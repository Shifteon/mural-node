const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { getArtworkFromTable } = require('../db/artworkUtil');

const TABLE_NAME = "users";

exports.putUser = (user) => {
  // Set the parameters
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(user)
  };
  const command = new PutItemCommand(params);
  return ddbClient.send(command);
};

exports.getUser = (username) => {
  // Set the parameters
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ username: username })
  };
  const command = new GetItemCommand(params);
  return ddbClient.send(command);
};

exports.addArtworkToUser = (artwork, username) => {
  const artworkKey = marshall([{ date: artwork.date, username: artwork.username }]);
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ username: username }),
    UpdateExpression: 'set artwork = list_append(:artworkKey, artwork)',
    ExpressionAttributeValues: { ':artworkKey': {"L": artworkKey } }
  }

  const command = new UpdateItemCommand(params);
  return ddbClient.send(command);
};

exports.getArtworkFromUser = async (username) => {
  const key = { username: username };
  return await getArtworkFromTable(key, TABLE_NAME);
};