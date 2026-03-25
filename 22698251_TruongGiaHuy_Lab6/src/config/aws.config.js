const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');

const clientConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
};

// Only add credentials if they are provided, otherwise AWS SDK will look for them elsewhere
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
    if (process.env.AWS_SESSION_TOKEN) {
        clientConfig.credentials.sessionToken = process.env.AWS_SESSION_TOKEN;
    }
}

const dynamoClient = new DynamoDBClient(clientConfig);
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Products';

const s3Client = new S3Client(clientConfig);
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'my-app-products-bucket';

module.exports = { dynamoDB, TABLE_NAME, s3Client, S3_BUCKET_NAME };
