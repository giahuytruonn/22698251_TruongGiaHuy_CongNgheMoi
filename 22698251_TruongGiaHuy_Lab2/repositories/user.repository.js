const BaseRepository = require("./base.repository");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

class UserRepository extends BaseRepository {
    constructor() {
        super(process.env.TABLE_USERS);
    }

    async findByUsername(username) {
        const params = {
            TableName: this.tableName,
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };

        const result = await this.docClient.send(new ScanCommand(params));
        return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    }
}

module.exports = new UserRepository();
