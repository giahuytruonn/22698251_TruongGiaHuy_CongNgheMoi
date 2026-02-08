const {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../services/dynamodb");

const tableName = process.env.DYNAMODB_TABLE;

const list = async () => {
  const result = await ddbDocClient.send(new ScanCommand({ TableName: tableName }));
  return result.Items || [];
};

const findById = async (id) => {
  const result = await ddbDocClient.send(
    new GetCommand({ TableName: tableName, Key: { id } })
  );
  return result.Item;
};

const create = async (product) => {
  await ddbDocClient.send(
    new PutCommand({
      TableName: tableName,
      Item: product
    })
  );
};

const update = async (id, product) => {
  await ddbDocClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: "SET #name = :name, price = :price, url_image = :url_image",
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": product.name,
        ":price": product.price,
        ":url_image": product.url_image
      }
    })
  );
};

const remove = async (id) => {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id }
    })
  );
};

module.exports = {
  list,
  findById,
  create,
  update,
  remove
};

