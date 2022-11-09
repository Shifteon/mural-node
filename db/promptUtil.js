const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = "prompts";

exports.getTodaysPrompt = () => {
  const date = new Date();
  const dateKey = `${date.getUTCMonth()}${date.getUTCDate()}${date.getUTCFullYear()}`
  console.log(dateKey);

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