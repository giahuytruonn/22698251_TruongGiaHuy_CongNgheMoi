const { dynamoDB, TABLE_NAME } = require('../config/aws.config');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

class Product {
    static async getAll() {
        const params = { TableName: TABLE_NAME };
        try {
            const data = await dynamoDB.send(new ScanCommand(params));
            return data.Items || [];
        } catch (error) {
            console.error("Error in getAll:", error);
            throw error;
        }
    }

    static async getById(id) {
        const params = {
            TableName: TABLE_NAME,
            Key: { id }
        };
        try {
            const data = await dynamoDB.send(new GetCommand(params));
            return data.Item;
        } catch (error) {
            console.error("Error in getById:", error);
            throw error;
        }
    }

    static async create(product) {
        const params = {
            TableName: TABLE_NAME,
            Item: product
        };
        try {
            await dynamoDB.send(new PutCommand(params));
            return product;
        } catch (error) {
            console.error("Error in create:", error);
            throw error;
        }
    }

    static async update(id, updates) {
        let updateExpression = "set #n = :n, price = :p, unit_in_stock = :u";
        let expressionAttributeNames = {
            "#n": "name"
        };
        let expressionAttributeValues = {
            ":n": updates.name,
            ":p": updates.price,
            ":u": updates.unit_in_stock
        };

        if (updates.url_image) {
            updateExpression += ", url_image = :img";
            expressionAttributeValues[":img"] = updates.url_image;
        }

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        };

        try {
            await dynamoDB.send(new UpdateCommand(params));
        } catch (error) {
            console.error("Error in update:", error);
            throw error;
        }
    }

    static async delete(id) {
        const params = {
            TableName: TABLE_NAME,
            Key: { id }
        };
        try {
            await dynamoDB.send(new DeleteCommand(params));
        } catch (error) {
            console.error("Error in delete:", error);
            throw error;
        }
    }
}

module.exports = Product;
