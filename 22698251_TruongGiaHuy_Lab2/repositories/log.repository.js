const BaseRepository = require("./base.repository");

class LogRepository extends BaseRepository {
    constructor() {
        super(process.env.TABLE_LOGS);
    }
}

module.exports = new LogRepository();
