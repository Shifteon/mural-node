const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

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