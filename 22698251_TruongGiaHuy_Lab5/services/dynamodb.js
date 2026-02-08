const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand
} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const ensureProductsTable = async () => {
  const tableName = process.env.DYNAMODB_TABLE;
  if (!tableName) {
    throw new Error("Missing DYNAMODB_TABLE in .env");
  }

  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return;
  } catch (err) {
    if (err.name !== "ResourceNotFoundException") {
      throw err;
    }
  }

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST"
    })
  );
};

module.exports = {
  client,
  ddbDocClient,
  ensureProductsTable
};

