require("dotenv").config();
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("./services/dynamodb");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const seedParams = {
    users: [
        { username: "admin", password: "admin", role: "admin" },
        { username: "staff", password: "staff", role: "staff" }
    ]
};

async function seed() {
    console.log("Starting seeder...");

    // Seed Users
    for (const u of seedParams.users) {
        // Check if exists
        const result = await ddbDocClient.send(new ScanCommand({
            TableName: process.env.TABLE_USERS,
            FilterExpression: "username = :u",
            ExpressionAttributeValues: { ":u": u.username }
        }));

        if (result.Items && result.Items.length > 0) {
            console.log(`User ${u.username} already exists. Skipping.`);
        } else {
            console.log(`Creating user ${u.username}...`);
            const hashedPassword = await bcrypt.hash(u.password, 10);
            await ddbDocClient.send(new PutCommand({
                TableName: process.env.TABLE_USERS,
                Item: {
                    userId: uuidv4(),
                    username: u.username,
                    password: hashedPassword,
                    role: u.role,
                    createdAt: new Date().toISOString()
                }
            }));
            console.log(`User ${u.username} created.`);
        }
    }

    console.log("Seeding complete.");
}

seed();
