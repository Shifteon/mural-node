const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = "users";

export const putUser = (user) => {
  // Set the parameters
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(user)
  };
  const command = new PutItemCommand(params);
  return ddbClient.send(command);
};

export const getUser = (username) => {
  // Set the parameters
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ username: username })
  };
  const command = new GetItemCommand(params);
  return ddbClient.send(command);
};