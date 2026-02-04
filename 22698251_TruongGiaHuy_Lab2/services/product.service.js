const productRepository = require("../repositories/product.repository");
const logService = require("./log.service");
const { uploadImage, deleteImageByUrl } = require("./s3");
const { v4: uuidv4 } = require("uuid");

class ProductService {
    async getAllProducts(filters = {}) {
        return await productRepository.search(filters);
    }

    async getProductById(id) {
        return await productRepository.findById({ id });
    }

    async createProduct(data, file, userId) {
        const imageUrl = file ? await uploadImage(file) : "";

        const product = {
            id: uuidv4(),
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            categoryId: data.categoryId,
            url_image: imageUrl,
            isDeleted: false,
            createdAt: new Date().toISOString()
        };

        await productRepository.create(product);
        await logService.logAction('CREATE', product.id, userId);
        return product;
    }

    async updateProduct(id, data, file, userId) {
        let updateData = {
            "#n": "name"
        };
        let values = {
            ":n": data.name,
            ":p": Number(data.price),
            ":q": Number(data.quantity),
            ":c": data.categoryId
        };
        let updateExp = "set #n=:n, price=:p, quantity=:q, categoryId=:c";

        if (file) {
            const imageUrl = await uploadImage(file);
            updateExp += ", url_image=:i";
            values[":i"] = imageUrl;

            // Should delete old image? Maybe later implementation
        }

        const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
        const { ddbDocClient } = require("./dynamodb");

        // Note: Repository update usage is tricky with dynamic expressions. 
        // We will call ddb directly here or refactor repo to generic update. 
        // For now, let's keep logic here to respect the strict deadline, 
        // or cleaner: use the repo's docClient.

        await ddbDocClient.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: updateData,
            ExpressionAttributeValues: values
        }));

        await logService.logAction('UPDATE', id, userId);
    }

    async deleteProduct(id, userId) {
        // Soft delete
        await productRepository.softDelete(id);
        await logService.logAction('DELETE', id, userId);
    }
}

module.exports = new ProductService();
