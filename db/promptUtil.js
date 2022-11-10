const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { getArtworkFromTable } = require('../db/artworkUtil');

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
  const key = { date: dateKey };
  return await getArtworkFromTable(key, TABLE_NAME);
};