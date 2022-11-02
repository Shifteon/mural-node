const ddbClient = require("../libs/ddbClient");
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = "users";

const putUser = (user) => {
  // Set the parameters
  const params = {
    TableName: TABLE_NAME,
    Item: marshall(user),
  };
  const command = new PutItemCommand(params);
  ddbClient.send(command)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = putUser;