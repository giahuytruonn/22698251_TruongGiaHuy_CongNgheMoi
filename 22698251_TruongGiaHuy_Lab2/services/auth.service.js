const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class AuthService {
    async login(username, password) {
        const user = await userRepository.findByUsername(username);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }

    async register(username, password, role = 'staff') {
        // Check if user exists
        const existing = await userRepository.findByUsername(username);
        if (existing) throw new Error("Username already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            userId: uuidv4(),
            username,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString()
        };

        return await userRepository.create(user);
    }
}

module.exports = new AuthService();
