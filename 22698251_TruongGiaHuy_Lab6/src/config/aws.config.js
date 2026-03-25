const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const clientConfig = {
    region: process.env.AWS_REGION || 'ap-southeast-2',
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
    if (process.env.AWS_SESSION_TOKEN) {
        clientConfig.credentials.sessionToken = process.env.AWS_SESSION_TOKEN;
    }
}

const client = new DynamoDBClient(clientConfig);
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Products';

module.exports = { dynamoDB, TABLE_NAME };
