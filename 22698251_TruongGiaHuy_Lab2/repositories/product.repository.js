const BaseRepository = require("./base.repository");
const { ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

class ProductRepository extends BaseRepository {
    constructor() {
        super(process.env.DYNAMODB_TABLE); // Products1
    }

    // Override findAll to filter isDeleted usually
    // But scan is expensive. We will try to filter in app or FilterExpression.
    async findAllActive() {
        const params = {
            TableName: this.tableName,
            FilterExpression: "attribute_not_exists(isDeleted) OR isDeleted = :false",
            ExpressionAttributeValues: {
                ":false": false
            }
        };

        const result = await this.docClient.send(new ScanCommand(params));
        return result.Items || [];
    }

    async softDelete(id) {
        // Soft delete: Update isDeleted = true
        return await this.docClient.send(new UpdateCommand({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: "set isDeleted = :true",
            ExpressionAttributeValues: {
                ":true": true
            }
        }));
    }

    async search(filters) {
        // Build FilterExpression dynamically
        let filterExp = [];
        let expAttrValues = {};
        let expAttrNames = {};

        // Default: Only active products
        filterExp.push("(attribute_not_exists(isDeleted) OR isDeleted = :false)");
        expAttrValues[":false"] = false;

        if (filters.name) {
            filterExp.push("contains(#n, :name)");
            expAttrNames["#n"] = "name";
            expAttrValues[":name"] = filters.name;
        }

        if (filters.categoryId) {
            filterExp.push("categoryId = :cat");
            expAttrValues[":cat"] = filters.categoryId;
        }

        if (filters.minPrice) {
            filterExp.push("price >= :minP");
            expAttrValues[":minP"] = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            filterExp.push("price <= :maxP");
            expAttrValues[":maxP"] = Number(filters.maxPrice);
        }

        if (filterExp.length === 0) return this.findAllActive();

        const params = {
            TableName: this.tableName,
            FilterExpression: filterExp.join(" AND "),
            ExpressionAttributeValues: expAttrValues
        };

        if (Object.keys(expAttrNames).length > 0) {
            params.ExpressionAttributeNames = expAttrNames;
        }

        const result = await this.docClient.send(new ScanCommand(params));
        return result.Items || [];
    }
}

module.exports = new ProductRepository();
