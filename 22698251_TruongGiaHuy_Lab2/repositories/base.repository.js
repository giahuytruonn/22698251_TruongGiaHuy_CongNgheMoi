const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../services/dynamodb");
const { v4: uuidv4 } = require("uuid");

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
        this.docClient = ddbDocClient;
    }

    async create(item) {
        if (!item.id && !item.userId && !item.categoryId && !item.logId) {
             // Fallback if no specialized ID provided, though usually child classes handle ID
             item.id = uuidv4();
        }
        
        await this.docClient.send(new PutCommand({
            TableName: this.tableName,
            Item: item
        }));
        return item;
    }

    async findAll() {
        const result = await this.docClient.send(new ScanCommand({
            TableName: this.tableName
        }));
        return result.Items || [];
    }

    async findById(key) {
        const result = await this.docClient.send(new GetCommand({
            TableName: this.tableName,
            Key: key
        }));
        return result.Item;
    }

    async delete(key) {
        return await this.docClient.send(new DeleteCommand({
            TableName: this.tableName,
            Key: key
        }));
    }
}

module.exports = BaseRepository;
