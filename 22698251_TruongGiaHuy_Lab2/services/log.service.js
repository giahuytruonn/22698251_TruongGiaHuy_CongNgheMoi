const logRepository = require("../repositories/log.repository");
const { v4: uuidv4 } = require("uuid");

class LogService {
    async logAction(action, productId, userId) {
        const log = {
            logId: uuidv4(),
            productId,
            userId: userId || 'system',
            action,
            time: new Date().toISOString()
        };
        await logRepository.create(log);
    }
}

module.exports = new LogService();
