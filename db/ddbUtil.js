const ddbClient = require("../libs/ddbClient");
const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

exports.putItem = (item, tableName) => {
  // Set the parameters
  const params = {
    TableName: tableName,
    Item: marshall(item)
  };
  const command = new PutItemCommand(params);
  return ddbClient.send(command);
};

exports.getItem = (tableName, key) => {
  // Set the parameters
  const params = {
    TableName: tableName,
    Key: marshall(key)
  };
  const command = new GetItemCommand(params);
  return ddbClient.send(command);
};