const db = require('../db/query');

const User = {
    async findByUsername(username) {
        const rows = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0] || null;
    },

    async create(username, hashedPassword) {
        const result = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        return result;
    },

    async findById(id) {
        const rows = await db.query(
            'SELECT id, username, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }
};

module.exports = User;
